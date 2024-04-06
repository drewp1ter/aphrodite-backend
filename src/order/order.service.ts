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
@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Address)
    private readonly addressRepository: AddressRepository
  ) {}

  async create(dto: CreateOrderDto) {
    return this.em.transactional(async (em: EntityManager) => {
      let user = await this.userRepository.findOne({ phone: dto.phone })
      user ??= new User({ name: dto.name, phone: dto.phone })

      let address = await this.addressRepository.findOne({ city: dto.address.city, address: dto.address.address })
      address ??= new Address(dto.address)

      const order = new Order({ user, address, comment: dto.comment, paymentType: dto.paymentType })
      em.persist(user).persist(address).persist(order)

      for (const item of dto.items) {
        const orderItem = em.create(OrderItem, {
          order,
          product: item.productId,
          amount: item.amount
        })
        em.persist(orderItem)
      }

      await em.flush()

      let userAddress = await em.findOne(UserAddress, { user, address })
      if (!userAddress) {
        userAddress = em.create(UserAddress, { user, address })
        await em.persistAndFlush(userAddress)
      }

      return order.toJSON()
    })
  }

  async findOne(orderId: number, userId: number) {
    const order = await this.orderRepository.findOneOrFail({ id: orderId, user: userId })
    return order.toJSON()
  }

  async findAll(page: number = 1, pageSize: number = 30) {
    const offset = (page - 1) * pageSize
    return this.orderRepository.findAndCount({}, { limit: pageSize, offset, orderBy: { createdAt: 'DESC' } })
  }

  async findAllByUser({ userId, page = 1, pageSize = 30 }: FindAllByUserProps) {
    const offset = (page - 1) * pageSize
    return this.orderRepository.findAndCount({ user: userId }, { limit: pageSize, offset, orderBy: { createdAt: 'DESC' } })
  }

  async addProduct({ orderId, productId, amount = 1 }: AddProductProps) {
    try {
      const orderItem = this.em.create(OrderItem, {
        order: orderId,
        product: productId,
        amount
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

  async confirmOrder(orderId: number) {
    return this.orderRepository.nativeUpdate({ id: orderId }, { status: OrderStatus.Confirmed })
  }
}
