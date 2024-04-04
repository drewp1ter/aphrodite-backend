import { Entity, Property, ManyToOne, EntityDTO } from '@mikro-orm/core'
import { Product } from '../product/product.entity'
import { Order } from './order.entity'

@Entity()
export class OrderItem {
  @ManyToOne({ primary: true })
  order!: Order

  @ManyToOne({ primary: true })
  product!: Product

  @Property({ default: 1 })
  amount!: number
}
