import { Entity, PrimaryKey, EntityRepositoryType, Property, ManyToOne, EntityDTO, Index, ManyToMany, Collection, wrap, types } from '@mikro-orm/core'
import { ProductGroup } from './product-group.entity'
import { Order } from '../order/order.entity'
import { ProductRepository } from './product.repository'
@Entity({ repository: () => ProductRepository })
export class Product {
  [EntityRepositoryType]?: ProductRepository

  @PrimaryKey()
  id!: number

  @ManyToOne()
  group!: ProductGroup

  @ManyToMany({ entity: () => Order, mappedBy: order => order.products })
  orders = new Collection<Order>(this)

  @Property()
  @Index({ type: 'fulltext' })
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

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date

  @Property()
  createdAt: Date

  constructor(params: PartialBy<ProductDto, 'calories' | 'carbohydrates' | 'flags' | 'fats' | 'squirrels'>) {
    this.name = params.name
    this.description = params.description
    this.squirrels = params.squirrels ?? 0
    this.fats = params.fats ?? 0
    this.carbohydrates = params.carbohydrates ?? 0
    this.flags = params.flags ?? ProductFlags.none
    this.calories = params.calories ?? 0
    this.price = params.price
    this.createdAt = new Date()
    this.updatedAt = new Date()
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