import { EntityRepository } from '@mikro-orm/mysql'
import { Address } from './address.entity'

export class AddressRepository extends EntityRepository<Address> {
  async findAllUserAddresses(userId: number) {
    return this.em.createQueryBuilder(Address)
      .select(['id', 'city', 'address', 'isDefault'])
      .where({ user_id: userId })
      .getResult()
  }
}
