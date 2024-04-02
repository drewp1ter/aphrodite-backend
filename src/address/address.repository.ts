import { EntityRepository } from '@mikro-orm/mysql'
import { Address, AddressDto } from './address.entity'
import { CreateAddressDto } from './dto'

export class AddressRepository extends EntityRepository<Address> {
  async findAllUserAddresses(userId: number) {
    return this.em.createQueryBuilder(Address).select(['id', 'city', 'address', 'isDefault']).where({ user_id: userId }).getResult()
  }

  async insertAndReturnId(userId: number, address: Address): Promise<number> {
    const { insertId } = await this.em
      .createQueryBuilder(Address)
      .insert({ user: userId, city: address.city, address: address.address, isDefault: address.isDefault ?? false })
      .returning()
    return insertId
  }
}
