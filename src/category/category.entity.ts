import { Entity, Property, OneToMany, EntityDTO, wrap, Collection, Index } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Product } from './product/product.entity'

@Entity()
export class Category extends BaseEntity {
  constructor(name: string, description: string) {
    super()
    this.name = name
    this.description = description
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
  
  @OneToMany(() => Product, (product) => product.category, { orphanRemoval: true })
  products = new Collection<Product>(this)

  @Property()
  @Index({ type: 'fulltext' })
  name: string

  @Property({ default: '', length: 8192 })
  description: string

  toJSON() {
    return wrap<Category>(this).toObject() as CategoryDto
  }
}

export interface CategoryDto extends EntityDTO<Category> {}
