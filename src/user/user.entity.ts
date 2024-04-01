import { IsEmail, IsPhoneNumber, IsOptional } from 'class-validator'
import crypto from 'crypto'
import { Collection, Entity, EntityDTO, EntityRepositoryType, ManyToMany, PrimaryKey, Property, Unique, wrap } from '@mikro-orm/core'
import { Role } from '../role/role.entity'
import { UserRepository } from './user.repository'
import { CreateUserDto } from './dto'

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

  @Property({ default: '' })
  @IsOptional()
  @IsPhoneNumber()
  phone?: string

  @Property({ hidden: true })
  password: string

  @ManyToMany({ hidden: true })
  roles = new Collection<Role>(this)

  constructor({ username, email, password, phone }: CreateUserDto) {
    this.username = username
    this.email = email
    this.phone = phone
    this.password = crypto.createHmac('sha256', password).digest('hex')
  }

  toJSON(user?: User) {
    const o = wrap<User>(this).toObject() as UserDTO

    return o
  }
}

interface UserDTO extends EntityDTO<User> {
  following?: boolean
}
