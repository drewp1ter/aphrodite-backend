import { EntityRepository } from '@mikro-orm/mysql'
import { Address } from './address.entity'

export class AddressRepository extends EntityRepository<Address> {}
