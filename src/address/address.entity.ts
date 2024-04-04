import { Entity, EntityRepositoryType, Property, ManyToMany, Collection, EntityDTO, wrap, types } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { User } from '../user/user.entity'
import { AddressRepository } from './address.repository'

@Entity({ repository: () => AddressRepository })
export class Address extends BaseEntity {
  [EntityRepositoryType]?: AddressRepository

  @ManyToMany({ entity: () => User, mappedBy: 'addresses', hidden: true })
  users = new Collection<User>(this)

  @Property()
  city!: string

  @Property({ type: types.text })
  address!: string

  constructor(partial: Partial<Omit<Address, 'id' | 'users'>>) {
    super()
    Object.assign(this, partial)
  }

  toJSON() {
    return wrap<Address>(this).toObject() as AddressDto
  }
}

export interface AddressDto extends EntityDTO<Address> {}
