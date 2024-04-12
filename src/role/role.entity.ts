import { Entity, PrimaryKey, Enum, ManyToMany, Collection } from '@mikro-orm/core'
import { RoleEnum } from './role.enum'
import { User } from '../user/user.entity'

@Entity()
export class Role {
  @PrimaryKey()
  id!: number

  @ManyToMany({ entity: () => User, mappedBy: 'roles', hidden: true, eager: false })
  users = new Collection<User>(this)

  @Enum({ items: () => RoleEnum, unique: true })
  role!: RoleEnum

  constructor (role: RoleEnum) {
    this.role = role
  }
}