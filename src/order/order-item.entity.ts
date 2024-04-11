import { Entity, Property, ManyToOne, Check, PrimaryKeyProp, EntityDTO, types, wrap } from '@mikro-orm/core'
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

  toJSON() {
    const orderItem = wrap<OrderItem>(this).toObject() as OrderItemDto
    return orderItem
  }
}

export interface OrderItemDto extends EntityDTO<OrderItem> {}