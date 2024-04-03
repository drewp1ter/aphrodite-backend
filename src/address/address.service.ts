import { Injectable } from '@nestjs/common'
import { EntityManager, } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Address } from './address.entity'
import { AddressRepository } from './address.repository'
import { CreateAddressDto } from './dto'
import { User } from '../user/user.entity'

@Injectable()
export class AddressService {

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Address)
    private readonly addressRepository: AddressRepository,
  ) {}

  async create(userId: number, dto: CreateAddressDto) {
    let address
    const user = new User('', '', '')
    user.id = userId

    address = await this.addressRepository.findOne({ user: userId, city: dto.city, address: dto.address }, { exclude: ['user'] })
    if (address) {
      return address.toJSON()
    }

    address = new Address(user, dto.city, dto.address)
    address.id = await this.addressRepository.insertAndReturnId(address)
    return address.toJSON()
  }

  async findAll(userId: number) {
    return this.addressRepository.findAllUserAddresses(userId)
  }

  async delete(userId: number, id: number) {
    return this.addressRepository.nativeDelete({ user: userId, id })
  }
}
