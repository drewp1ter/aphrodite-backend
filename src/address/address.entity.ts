import { Entity, PrimaryKey, EntityRepositoryType, Property, ManyToMany, Collection, EntityDTO, wrap, types } from '@mikro-orm/core'
import { User } from '../user/user.entity'
import { AddressRepository } from './address.repository'

@Entity({ repository: () => AddressRepository })
export class Address {
  [EntityRepositoryType]?: AddressRepository

  @PrimaryKey()
  id!: number

  @ManyToMany({ entity: () => User, mappedBy: 'addresses', hidden: true })
  users = new Collection<User>(this)

  @Property()
  city!: string

  @Property({ type: types.text })
  address!: string

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date()

  @Property()
  createdAt = new Date()

  constructor(partial: Partial<Omit<Address, 'id' | 'users'>>) {
    Object.assign(this, partial)
  }

  toJSON() {
    return wrap<Address>(this).toObject() as AddressDto
  }
}

export interface AddressDto extends EntityDTO<Address> {}
