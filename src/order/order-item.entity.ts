import { Entity, Property, ManyToOne, Check } from '@mikro-orm/core'
import { Product } from '../category/product/product.entity'
import { Order } from './order.entity'

@Entity()
export class OrderItem {
  @ManyToOne({ primary: true })
  order!: Order

  @ManyToOne({ primary: true })
  product!: Product

  @Property({ default: 1 })
  @Check({ expression: 'amount > 0' })
  amount!: number
}
