import { Injectable } from '@nestjs/common'
import { EntityManager, } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Address } from './address.entity'
import { AddressRepository } from './address.repository'
import { CreateAddressDto } from './dto'

@Injectable()
export class AddressService {

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Address)
    private readonly addressRepository: AddressRepository,
  ) {}

  async create(userId: number, dto: CreateAddressDto) {
    let address

    address = await this.addressRepository.findOne({ city: dto.city, address: dto.address }, { exclude: ['user'] })
    if (address) {
      return address.toJSON()
    }

    address = new Address(dto.city, dto.address, dto.isDefault)
    address.id = await this.addressRepository.insertAndReturnId(userId, address)
    return address.toJSON()
  }

  async findAll(userId: number) {
    return this.addressRepository.findAllUserAddresses(userId)
  }

  async delete(userId: number, id: number) {
    return this.addressRepository.nativeDelete({ user: userId, id })
  }
}
