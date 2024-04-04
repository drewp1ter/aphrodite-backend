import { IsEmail, IsPhoneNumber } from 'class-validator'
import crypto from 'crypto'
import { Collection, Entity, EntityDTO, EntityRepositoryType, ManyToMany, Property, wrap } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Address } from '../address/address.entity'
import { UserRepository } from './user.repository'
import { UserAddress } from './user-address.entity'

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository

  @Property()
  name!: string

  @Property({ default: '' })
  @IsEmail()
  email!: string

  @Property({ unique: true })
  @IsPhoneNumber()
  phone!: string

  @Property({ hidden: true })
  password: string

  @ManyToMany({ entity: () => Address, pivotEntity: () => UserAddress })
  addresses = new Collection<Address>(this)

  @Property({ hidden: true, default: false })
  isEmailConfirmed!: boolean

  @Property({ hidden: true, default: false })
  isPhoneConfirmed!: boolean

  @Property({ hidden: true, default: false })
  isAdmin!: boolean

  constructor(partial: Partial<Pick<User, 'name' | 'email' | 'password' | 'phone'>>) {
    super()
    Object.assign(this, partial)
    this.password = partial.password ? crypto.createHmac('sha256', partial.password).digest('hex') : ''
  }

  toJSON() {
    const o = wrap<User>(this).toObject() as UserDTO
    return o
  }
}

interface UserDTO extends EntityDTO<User> {
}
