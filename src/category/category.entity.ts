import { Entity, Property, OneToMany, EntityDTO, wrap, Collection, Index, EntityRepositoryType } from '@mikro-orm/core'
import { IikoEntity } from '../shared/entities/iiko.entity'
import { Product } from '../product/product.entity'
import { CategoryImage } from '../category-image/category-image.entity'
import { CategoryRepository } from './category.repository'

@Entity({ repository: () => CategoryRepository })
export class Category extends IikoEntity {
  [EntityRepositoryType]?: CategoryRepository
  
  constructor(partial: RequiredBy<Category, 'name'>) {
    super()
    this.iikoId = partial.iikoId
    this.name = partial.name
    this.description = partial.description ?? ''
    this.createdAt = partial.createdAt
    this.updatedAt = partial.updatedAt
  }

  @OneToMany(() => CategoryImage, image => image.category, { orphanRemoval: true, eager: true })
  images = new Collection<CategoryImage>(this)

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
