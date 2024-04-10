import { Injectable } from '@nestjs/common'
import { EntityManager, UniqueConstraintViolationException } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserRepository } from '../user/user.repository'
import { Address } from '../address/address.entity'
import { AddressRepository } from '../address/address.repository'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderItem } from './order-item.entity'
import { UserAddress } from '../user/user-address.entity'
import { OrderRepository } from './order.repository'
import { OrderStatus } from './order.entity'
import { config } from '../config'
import { Product } from '../category/product/product.entity'
import { ProductRepository } from '../category/product/product.repository'
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

      const order = new Order({ customer, address, comment: dto.comment, paymentType: dto.paymentType })
      for (const product of products) {
        const amount = dto.items.find((item) => item.productId === product.id)!.amount
        em.create(OrderItem, {
          order,
          product: product.id,
          amount,
          offeredPrice: product.price
        })
      }

      let userAddress = await em.count(UserAddress, { user: customer, address })
      if (!userAddress) {
        em.create(UserAddress, { user: customer, address })
      }

      return order
    })

    await this.em.refresh(order, { populate: ['items'] })
    return order!.toJSON()
  }

  async findOne(orderId: number, customerId: number) {
    const order = await this.orderRepository.findOneOrFail({ id: orderId, customer: customerId })
    return order.toJSON()
  }

  async findAll(page: number = 1, pageSize: number = config.defaultPageSize) {
    const offset = (page - 1) * pageSize
    return this.orderRepository.findAndCount({}, { limit: pageSize, offset, orderBy: { createdAt: 'DESC' } })
  }

  async findAllByUser({ customerId, page = 1, pageSize = config.defaultPageSize }: FindAllByUserProps) {
    const offset = (page - 1) * pageSize
    return this.orderRepository.findAndCount({ customer: customerId }, { limit: pageSize, offset, orderBy: { createdAt: 'DESC' } })
  }

  async addProduct({ orderId, productId, amount = 1 }: AddProductProps) {
    try {
      const product = await this.productRepository.findOneOrFail(productId, { fields: ['id', 'price'] })
      const orderItem = this.em.create(OrderItem, {
        order: orderId,
        product: product.id,
        amount,
        offeredPrice: product.price
      })

      this.em.persist(orderItem)
    } catch (e) {
      if (e instanceof UniqueConstraintViolationException) {
        this.em.nativeUpdate(OrderItem, { order: orderId, product: productId }, { amount })
      }
      throw e
    }

    const order = await this.orderRepository.findOneOrFail(orderId)
    return order.toJSON()
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
