import { EntityRepository } from '@mikro-orm/mysql'
import { Transaction } from '@mikro-orm/core'
import { Address, AddressDto } from './address.entity'

export class AddressRepository extends EntityRepository<Address> {}
