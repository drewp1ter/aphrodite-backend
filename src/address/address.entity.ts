import { Entity, PrimaryKey, EntityRepositoryType, Property, ManyToOne, EntityDTO, wrap, types } from '@mikro-orm/core'
import { User } from '../user/user.entity'
import { AddressRepository } from './address.repository'

@Entity({ repository: () => AddressRepository })
export class Address {
  [EntityRepositoryType]?: AddressRepository

  @PrimaryKey()
  id!: number

  @ManyToOne()
  user!: User

  @Property()
  city: string

  @Property({ type: types.text })
  address: string

  @Property({ default: false })
  isDefault: boolean

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date

  @Property()
  createdAt: Date

  constructor(city: string, address: string, isDefalt: boolean = false) {
    this.city = city
    this.address = address
    this.isDefault = isDefalt
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  toJSON() {
    return wrap<Address>(this).toObject() as AddressDto
  }
}

export interface AddressDto extends EntityDTO<Address> {}
