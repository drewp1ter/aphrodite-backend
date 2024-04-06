import { IsEmail, IsPhoneNumber } from 'class-validator'
import crypto from 'crypto'
import { Collection, Entity, EntityDTO, EntityRepositoryType, ManyToMany, Property, wrap } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Address } from '../address/address.entity'
import { UserRepository } from './user.repository'
import { UserAddress } from './user-address.entity'
import { Role } from './role/role.entity'

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository

  @ManyToMany({ entity: () => Role, eager: true })
  roles = new Collection<Role>(this)

  @ManyToMany({ entity: () => Address, pivotEntity: () => UserAddress })
  addresses = new Collection<Address>(this)

  @Property()
  name!: string

  @Property({ unique: true, default: '' })
  @IsEmail()
  email!: string

  @Property({ unique: true })
  @IsPhoneNumber()
  phone!: string

  @Property({ hidden: true })
  password: string

  @Property({ hidden: true, default: false })
  isEmailConfirmed!: boolean

  @Property({ hidden: true, default: false })
  isPhoneConfirmed!: boolean

  constructor(partial: Partial<Pick<User, 'name' | 'email' | 'password' | 'phone' | 'roles'>>) {
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
