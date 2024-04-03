import { Entity, PrimaryKey, Property, OneToMany, EntityDTO, Index, wrap, Collection } from '@mikro-orm/core'
import { Product } from './product.entity'

@Entity()
export class ProductGroup {
  @PrimaryKey()
  id!: number

  @OneToMany(() => Product, product => product.group, { orphanRemoval: true })
  products = new Collection<Product>(this)

  @Property()
  @Index({ type: 'fulltext' })
  name: string

  @Property({ default: '', length: 8192 })
  description: string

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date

  @Property()
  createdAt: Date

  constructor (name: string, description: string) {
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