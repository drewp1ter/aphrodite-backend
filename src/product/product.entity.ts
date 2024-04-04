import { Entity, EntityRepositoryType, Property, ManyToOne, EntityDTO, ManyToMany, Collection, wrap, types } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { ProductGroup } from './product-group.entity'
import { Order } from '../order/order.entity'
import { ProductRepository } from './product.repository'
@Entity({ repository: () => ProductRepository })
export class Product extends BaseEntity {
  [EntityRepositoryType]?: ProductRepository

  @ManyToOne({ hidden: true })
  group!: ProductGroup

  @ManyToMany({ entity: () => Order, mappedBy: 'products', hidden: true })
  orders = new Collection<Order>(this)

  @Property({ index: 'fulltext' })
  name: string

  @Property({ default: '', length: 8192 })
  description: string

  @Property({ type: types.float, default: 0 })
  squirrels: number

  @Property({ type: types.float, default: 0 })
  fats: number

  @Property({ type: types.float, default: 0 })
  carbohydrates: number

  @Property({ type: types.smallint, default: 0 })
  flags: ProductFlags

  @Property({ default: 0 })
  calories: number

  @Property({ type: types.float })
  price: number

  constructor(
    partial: PartialBy<Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'orders'>, 'calories' | 'carbohydrates' | 'flags' | 'fats' | 'squirrels'>
  ) {
    super()
    this.name = partial.name
    this.description = partial.description
    this.squirrels = partial.squirrels ?? 0
    this.fats = partial.fats ?? 0
    this.carbohydrates = partial.carbohydrates ?? 0
    this.flags = partial.flags ?? ProductFlags.none
    this.calories = partial.calories ?? 0
    this.price = partial.price
  }

  toJSON() {
    return wrap<Product>(this).toObject() as ProductDto
  }
}

export interface ProductDto extends EntityDTO<Product> {}

export enum ProductFlags {
  none = 0,
  hot = 1,
  alergic = 2,
  vegeterian = 4
}
