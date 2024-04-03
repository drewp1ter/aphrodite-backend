import { EntityRepository } from '@mikro-orm/mysql'
import { Address } from './address.entity'

export class AddressRepository extends EntityRepository<Address> {
  async findAllUserAddresses(userId: number) {
    return this.em.createQueryBuilder(Address).select(['id', 'city', 'address', 'isDefault']).where({ user_id: userId }).getResult()
  }

  async insertAndReturnId(userId: number, address: Address): Promise<number> {
    const { insertId } = await this.em
      .createQueryBuilder(Address)
      .insert({
        user: userId,
        city: address.city,
        address: address.address,
        isDefault: address.isDefault ?? false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning()
    return insertId
  }
}
