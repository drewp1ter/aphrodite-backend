import { IsEmail, IsPhoneNumber } from 'class-validator'
import crypto from 'crypto'
import { Collection, Entity, EntityDTO, EntityRepositoryType, ManyToMany, PrimaryKey, Property, Unique, wrap } from '@mikro-orm/core'
import { Role } from '../role/role.entity'
import { Address } from '../address/address.entity'
import { UserRepository } from './user.repository'

@Entity({ repository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository

  @PrimaryKey()
  id!: number

  @Property()
  name!: string

  @Property({ default: '' })
  @IsEmail()
  email!: string

  @Property()
  @Unique()
  @IsPhoneNumber()
  phone!: string

  @Property({ hidden: true })
  password: string

  @ManyToMany({ entity: () => Address, pivotEntity: () => Address })
  addresses = new Collection<Address>(this)

  @ManyToMany({ entity: () => Role, hidden: true })
  roles = new Collection<Role>(this)

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date

  @Property()
  createdAt: Date

  constructor(partial: Partial<Pick<User, 'name' | 'email' | 'password' | 'phone'>>) {
    Object.assign(this, partial)
    this.password = partial.password ? crypto.createHmac('sha256', partial.password).digest('hex') : ''
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  toJSON() {
    const o = wrap<User>(this).toObject() as UserDTO
    return o
  }
}

interface UserDTO extends EntityDTO<User> {
}
