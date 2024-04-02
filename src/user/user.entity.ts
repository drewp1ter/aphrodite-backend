import { IsEmail, IsPhoneNumber, IsOptional } from 'class-validator'
import crypto from 'crypto'
import { Collection, Entity, EntityDTO, EntityRepositoryType, ManyToMany, OneToMany, PrimaryKey, Property, Unique, wrap } from '@mikro-orm/core'
import { Role } from '../role/role.entity'
import { Address } from '../address/address.entity'
import { UserRepository } from './user.repository'

@Entity({ repository: () => UserRepository })
export class User {
  [EntityRepositoryType]?: UserRepository

  @PrimaryKey()
  id!: number

  @Property()
  username: string

  @Property()
  @Unique()
  @IsEmail()
  email: string

  @Property({ nullable: true, default: '' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string

  @Property({ hidden: true })
  password: string

  @OneToMany(() => Address, address => address.user, { orphanRemoval: true })
  addresses = new Collection<Address>(this)

  @ManyToMany(() => Role)
  roles = new Collection<Role>(this)

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date

  @Property()
  createdAt: Date

  constructor(username: string, email: string, password: string, phone: string = '') {
    this.username = username
    this.email = email
    this.phone = phone
    this.password = crypto.createHmac('sha256', password).digest('hex')
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  toJSON(user?: User) {
    const o = wrap<User>(this).toObject() as UserDTO

    return o
  }
}

interface UserDTO extends EntityDTO<User> {
}
