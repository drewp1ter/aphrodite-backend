import { Entity, EntityRepositoryType, Property, ManyToOne, EntityDTO, Collection, wrap, Index, types, Check, OneToMany } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { Category } from '../category/category.entity'
import { ProductRepository } from './product.repository'
import { ProductImage } from '../product-image/product-image.entity'

@Entity({ repository: () => ProductRepository })
export class Product extends BaseEntity {
  [EntityRepositoryType]?: ProductRepository

  constructor(
    partial: PartialBy<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'orders'>, 'calories' | 'carbohydrates' | 'flags' | 'fats' | 'proteins'>
  ) {
    super()
    this.name = partial.name
    this.description = partial.description
    this.proteins = partial.proteins ?? 0
    this.fats = partial.fats ?? 0
    this.carbohydrates = partial.carbohydrates ?? 0
    this.flags = partial.flags ?? ProductFlags.none
    this.calories = partial.calories ?? 0
    this.price = partial.price
  }

  @ManyToOne({ hidden: true, lazy: true })
  category!: Category

  @OneToMany(() => ProductImage, image => image.product, { orphanRemoval: true, eager: true })
  images = new Collection<ProductImage>(this)

  @Property()
  @Index({ type: 'fulltext' })
  name: string

  @Property({ default: '', length: 8192 })
  description: string

  @Property({ default: 0 })
  proteins: number

  @Property({ default: 0 })
  fats: number

  @Property({ default: 0 })
  carbohydrates: number

  @Property({ default: 0 })
  flags: ProductFlags

  @Property({ default: 0 })
  calories: number

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
