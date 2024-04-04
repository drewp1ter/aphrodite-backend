import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Address } from './address.entity'
import { CreateAddressDto } from './dto'
import { User } from '../user/user.entity'
import { UserRepository } from '../user/user.repository'
import { UserAddress } from '../user/user-address.entity'

@Injectable()
export class AddressService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly userRepository: UserRepository
  ) {}

  async create(userId: number, dto: CreateAddressDto) {
    const user = await this.userRepository.findOneOrFail(userId, { populate: ['addresses'] })
    if (!user.addresses.find((address) => address.city === dto.city && address.address === dto.address)) {
      const address = new Address(dto)
      user.addresses.add(address)
      this.em.persistAndFlush(user)
    }
  }

  async findAll(userId: number) {
    const result = await this.em.findAll(UserAddress, { where: { user: userId }, populate: ['address'], exclude: ['user'] })
    return result.map((userAddress) => userAddress.address)
  }

  async delete(userId: number, id: number) {
    return this.em.nativeDelete(UserAddress, { user: userId, address: id })
  }
}
