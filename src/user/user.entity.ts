import crypto from 'crypto'
import { Collection, Entity, EntityDTO, EntityRepositoryType, ManyToMany, Property, wrap } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Address } from '../address/address.entity'
import { UserRepository } from './user.repository'
import { UserAddress } from './user-address.entity'
import { Role } from '../auth/role/role.entity'

@Entity({ repository: () => UserRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UserRepository

  constructor(partial: Partial<Pick<User, 'name' | 'email' | 'password' | 'phone' | 'roles'>>) {
    super()
    Object.assign(this, partial)
    this.password = partial.password ? crypto.createHmac('sha256', partial.password).digest('hex') : ''
  }

  @ManyToMany({ entity: () => Role, eager: true })
  roles = new Collection<Role>(this)

  @ManyToMany({ entity: () => Address, pivotEntity: () => UserAddress, eager: false, owner: true })
  addresses = new Collection<Address>(this)

  @Property()
  name!: string

  @Property({ unique: true, nullable: true, serializer: (email) => email ?? '' })
  email!: string

  @Property({ unique: true })
  phone!: string

  @Property({ hidden: true, lazy: true })
  password: string

  @Property({ hidden: true, default: false, lazy: true })
  isEmailConfirmed!: boolean

  @Property({ hidden: true, default: false, lazy: true })
  isPhoneConfirmed!: boolean

  toJSON() {
    const o = wrap<User>(this).toObject() as UserDTO
    return o
  }
}

interface UserDTO extends EntityDTO<User> {}
