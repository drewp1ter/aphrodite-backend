import { Entity, EntityRepositoryType, Property, ManyToMany, Collection, EntityDTO, wrap, types } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { User } from '../user/user.entity'
import { AddressRepository } from './address.repository'

@Entity({ repository: () => AddressRepository })
export class Address extends BaseEntity {
  [EntityRepositoryType]?: AddressRepository

  constructor(partial: Partial<Omit<Address, 'id' | 'users'>>) {
    super()
    Object.assign(this, partial)
  }

  @Property()
  city!: string

  @Property({ type: types.text })
  address!: string

  toJSON() {
    return wrap<Address>(this).toObject() as AddressDto
  }
}

export interface AddressDto extends EntityDTO<Address> {}
