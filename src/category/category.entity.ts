import { Entity, Property, OneToMany, EntityDTO, wrap, Collection, Index, EntityRepositoryType } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Product } from '../product/product.entity'
import { CategoryRepository } from './category.repository'

@Entity({ repository: () => CategoryRepository })
export class Category extends BaseEntity {
  [EntityRepositoryType]?: CategoryRepository
  
  constructor(name: string, description: string) {
    super()
    this.name = name
    this.description = description
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }
  
  @OneToMany(() => Product, (product) => product.category, { orphanRemoval: true, eager: false })
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
