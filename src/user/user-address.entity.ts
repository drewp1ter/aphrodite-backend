import { Entity, ManyToOne } from '@mikro-orm/core'
import { User } from './user.entity'
import { Address } from '../address/address.entity'

@Entity()
export class UserAddress {
  @ManyToOne({ primary: true })
  user!: User

  @ManyToOne({ primary: true })
  address!: Address
}
