import { v4 } from 'uuid'
import { Entity, Property, OneToMany, EntityDTO, wrap, Collection, Index, EntityRepositoryType } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Product } from '../product/product.entity'
import { CategoryImage } from '../category-image/category-image.entity'
import { CategoryRepository } from './category.repository'

@Entity({ repository: () => CategoryRepository })
export class Category extends BaseEntity {
  [EntityRepositoryType]?: CategoryRepository
  
  constructor(partial: PartialBy<Category, 'iikoId'>) {
    super()
    this.iikoId = partial.iikoId ?? v4()
    this.name = partial.name
    this.description = partial.description
    this.createdAt = new Date()
    this.updatedAt = new Date()
  }

  @OneToMany(() => CategoryImage, image => image.category, { orphanRemoval: true, eager: true })
  images = new Collection<CategoryImage>(this)

  @Property({ type: 'uuid', index: true, hidden: true, lazy: true })
  iikoId!: string
  
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
