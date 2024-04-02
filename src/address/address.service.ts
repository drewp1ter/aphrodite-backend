import { Injectable } from '@nestjs/common'
import { EntityManager, } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityRepository } from '@mikro-orm/mysql'
import { User } from '../user/user.entity'
import { Address } from './address.entity'
import { AddressRepository } from './address.repository'
import { CreateAddressDto } from './dto'

@Injectable()
export class AddressService {

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Address)
    private readonly addressRepository: AddressRepository,
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>
  ) {}

  async create(userId: number, dto: CreateAddressDto) {
    const user = await this.userRepository.findOneOrFail(userId, { populate: ['addresses'] })
    const address = new Address(user, dto.city, dto.address, dto.isDefalt)
    user.addresses.add(address)
    await this.em.flush()

    return { address: address.toJSON() }
  }

  async findAll(userId: number) {
    return this.addressRepository.findAllUserAddresses(userId)
  }

  async delete(userId: number, id: number) {
    return this.addressRepository.nativeDelete({ user: userId, id })
  }
}
