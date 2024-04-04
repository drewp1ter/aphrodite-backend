import { Entity, Property, OneToMany, EntityDTO, wrap, Collection } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Product } from './product.entity'

@Entity()
export class ProductGroup extends BaseEntity {
  @OneToMany(() => Product, (product) => product.group, { orphanRemoval: true })
  products = new Collection<Product>(this)

  @Property({ index: 'fulltext' })
  name: string

  @Property({ default: '', length: 8192 })
  description: string

  constructor(name: string, description: string) {
    super()
    this.name = name
    this.description = description
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  toJSON() {
    return wrap<ProductGroup>(this).toObject() as ProductGroupDto
  }
}

export interface ProductGroupDto extends EntityDTO<ProductGroup> {}
