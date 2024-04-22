import { Entity, EntityRepositoryType, Property, ManyToOne, EntityDTO, Collection, wrap, Index, types, Check, OneToMany } from '@mikro-orm/core'
import { IikoEntity } from '../shared/entities/iiko.entity'
import { Category } from '../category/category.entity'
import { ProductRepository } from './product.repository'
import { ProductImage } from '../product-image/product-image.entity'

@Entity({ repository: () => ProductRepository })
export class Product extends IikoEntity {
  [EntityRepositoryType]?: ProductRepository

  constructor(
    partial: RequiredBy<Product, 'name' | 'price' | 'category'>
  ) {
    super()
    this.iikoId = partial.iikoId
    this.name = partial.name
    this.description = partial.description
    this.weight = partial.weight
    this.measureUnit = partial.measureUnit
    this.proteins = partial.proteins
    this.fats = partial.fats
    this.carbohydrates = partial.carbohydrates 
    this.flags = partial.flags
    this.calories = partial.calories
    this.price = partial.price
    this.category = partial.category
  }

  @ManyToOne({ hidden: true, lazy: true })
  category!: Category

  @OneToMany(() => ProductImage, image => image.product, { orphanRemoval: true, eager: true })
  images = new Collection<ProductImage>(this)

  @Property()
  @Index({ type: 'fulltext' })
  name: string

  @Property({ default: '', length: 8192 })
  description?: string

  @Property({ length: 80, default: '' })
  measureUnit?: string

  @Property({ type: types.float, default: 0 })
  @Check({ expression: 'weight >= 0' })
  weight?: number

  @Property({ default: 0 })
  proteins?: number

  @Property({ default: 0 })
  fats?: number

  @Property({ default: 0 })
  carbohydrates?: number

  @Property({ default: 0 })
  flags?: ProductFlags

  @Property({ default: 0 })
  calories?: number

  @Property({ type: types.float })
  @Check({ expression: 'price >= 0' })
  price: number

  toJSON() {
    const product = wrap<Product>(this).toObject() as ProductDto
    product.images = this.images.toJSON()
    return product
  }
}

export interface ProductDto extends EntityDTO<Product> {}

export enum ProductFlags {
  none = 0,
  hot = 1,
  alergic = 2,
  vegeterian = 4
}
