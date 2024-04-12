import { Injectable } from '@nestjs/common'
import { EntityManager, UniqueConstraintViolationException } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserRepository } from '../user/user.repository'
import { Address } from '../address/address.entity'
import { AddressRepository } from '../address/address.repository'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderItem } from '../order-item/order-item.entity'
import { UserAddress } from '../user/user-address.entity'
import { OrderRepository } from './order.repository'
import { OrderStatus } from './order.entity'
import { config } from '../config'
import { Product } from '../product/product.entity'
import { ProductRepository } from '../product/product.repository'

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Address)
    private readonly addressRepository: AddressRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository
  ) {}

  async create(dto: CreateOrderDto) {
    const order = await this.em.transactional(async (em: EntityManager) => {
      let customer = await this.userRepository.findOne({ phone: dto.phone })
      customer ??= new User({ name: dto.name, phone: dto.phone })

      let address = await this.addressRepository.findOne({ city: dto.address.city, address: dto.address.address })
      address ??= new Address(dto.address)

      const itemIds = dto.items.map((item) => item.productId)
      const products = await this.productRepository.findAll({ fields: ['id', 'price'], where: { id: { $in: itemIds } } })

      const createdItems = dto.items.map((item) => {
        const price = products.find((product) => product.id === item.productId)?.price ?? 0
        return new OrderItem({
          product: em.getReference(Product, item.productId),
          amount: item.amount,
          offeredPrice: price
        })
      })

      const order = new Order({ customer, address, comment: dto.comment, paymentType: dto.paymentType })
      order.items.set(createdItems)

      em.persist([address, customer, order])

      let userAddress = await em.count(UserAddress, { user: customer, address })
      if (!userAddress) {
        const createdAddress = em.create(UserAddress, { user: customer, address })
        em.persist(createdAddress)
      }

      await em.flush()
      return order
    })

    await this.em.refresh(order)
    return order!.toJSON()
  }

  async findOne(orderId: number, customerId: number) {
    const order = await this.orderRepository.findOneOrFail({ id: orderId, customer: customerId }, { populate: ['address'] })
    return order.toJSON()
  }

  async findAll(page: number = 1, pageSize: number = config.defaultPageSize) {
    const offset = (page - 1) * pageSize
    const [orders, count] = await this.orderRepository.findAndCount({}, { limit: pageSize, offset, orderBy: { createdAt: 'DESC' } })
    return { orders, count }
  }

  async findAllByUser({ customerId, page = 1, pageSize = config.defaultPageSize }: FindAllByUserProps) {
    const offset = (page - 1) * pageSize
    const [orders, count] = await this.orderRepository.findAndCount(
      { customer: customerId },
      { limit: pageSize, offset, orderBy: { id: 'DESC' }, populate: ['address'] }
    )

    return { orders, count }
  }

  async addProduct({ orderId, productId, amount = 1 }: AddProductProps) {
    try {
      const order = await this.em.transactional(async (em) => {
        const order = await this.orderRepository.findOneOrFail(orderId, { populate: ['address'], ctx: em })
        const product = await this.productRepository.findOneOrFail(productId, { ctx: em })
        order.items.add(new OrderItem({ product, amount, offeredPrice: product.price }))
        await em.persistAndFlush(order)
        return order
      })
      return order.toJSON()
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        this.em.nativeUpdate(OrderItem, { order: orderId, product: productId }, { amount })
      }
      throw e
    }
  }

  async removeProduct({ orderId, productId }: Omit<AddProductProps, 'amount'>) {
    return this.em.nativeDelete(OrderItem, { order: orderId, product: productId })
  }

  async delete(orderId: number) {
    return this.em.transactional(async (em) => {
      await em.nativeDelete(OrderItem, { order: orderId })
      return em.nativeDelete(Order, { id: orderId })
    })
  }

  async confirm(orderId: number) {
    return this.orderRepository.nativeUpdate({ id: orderId }, { status: OrderStatus.Confirmed })
  }
}

export interface FindAllByUserProps {
  customerId: number
  page?: number
  pageSize?: number
}

export interface AddProductProps {
  orderId: number
  productId: number
  amount?: number
}
