import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { UserRepository } from '../user/user.repository'
import { Address } from '../address/address.entity'
import { AddressRepository } from '../address/address.repository'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import { CreateOrderDto } from './dto/create-order.dto'
import { OrderItem } from './order-item.entity'
import { UserAddress } from '../user/user-address.entity'

@Injectable()
export class OrderService {
  constructor(
    private readonly em: EntityManager,
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
}
