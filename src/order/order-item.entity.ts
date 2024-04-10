import { Entity, Property, ManyToOne, Check, PrimaryKeyProp, types } from '@mikro-orm/core'
import { Product } from '../category/product/product.entity'
import { Order } from './order.entity'

@Entity()
export class OrderItem {
  [PrimaryKeyProp]?: ['order', 'product']

  constructor(partial: Partial<OrderItem>) {
    Object.assign(this, partial)
  }

  @ManyToOne({ primary: true, hidden: true })
  order!: Order

  @ManyToOne({ primary: true, eager: true })
  product!: Product

  @Property({ default: 1 })
  @Check({ expression: 'amount > 0' })
  amount!: number

  @Property({ type: types.float })
  @Check({ expression: 'offered_price >= 0' })
  offeredPrice!: number
}
