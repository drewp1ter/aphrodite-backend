import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserRepository } from '../user/user.repository'
import { Address } from '../address/address.entity'
import { AddressRepository } from '../address/address.repository'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import { OrderRepository } from './order.repository'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderItem } from './order-item.entity'

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    @InjectRepository(Address)
    private readonly addressRepository: AddressRepository,
    @InjectRepository(Order)
    private readonly orderRepository: OrderRepository
  ) {}

  async create(dto: CreateOrderDto) {
    return this.em.transactional(async (em: EntityManager) => {
      let user = await this.userRepository.findOne({ phone: dto.phone })
      if (!user) {
        user = new User(dto.name, '', dto.phone)
        await em.persistAndFlush(user)
      }

      let address = await this.addressRepository.findOne({ user, city: dto.address.city, address: dto.address.address })
      if (!address) {
        address = new Address(user, dto.address.city, dto.address.address)
        await em.persistAndFlush(address)
      }

      const order = new Order(user, address, dto.comment, dto.paymentType)
      await em.persistAndFlush(order)

      for (const item of dto.items) {
        const orderItem = em.create(OrderItem, {
          order,
          product: item.productId,
          amount: item.amount
        })
        em.persist(orderItem)
      }

      await em.flush()

      return order.toJSON()
    })
  }
}
