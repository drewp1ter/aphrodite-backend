import { Entity, EntityRepositoryType, Property, ManyToOne, ManyToMany, EntityDTO, Collection, wrap, types } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { User } from '../user/user.entity'
import { Product } from '../product/product.entity'
import { Address } from '../address/address.entity'
import { OrderItem } from './order-item.entity'
import { OrderRepository } from './order.repository'

export enum OrderStatus {
  new = 'new',
  payed = 'payed',
  canceled = 'canceled'
}

@Entity({ repository: () => OrderRepository })
export class Order extends BaseEntity {
  [EntityRepositoryType]?: OrderRepository

  @ManyToOne({ hidden: true })
  user!: User

  @ManyToOne({ nullable: true, hidden: true })
  address!: Address | null

  @ManyToMany({ entity: () => Product, pivotEntity: () => OrderItem, hidden: true })
  products = new Collection<Product>(this)

  @Property({ default: OrderStatus.new, hidden: true })
  status: OrderStatus

  @Property({ type: types.text, nullable: true })
  comment!: string

  @Property()
  paymentType!: OrderPaymentType

  constructor(partial: Pick<Order, 'user' | 'address' | 'comment' | 'paymentType'>) { 
    super()
    Object.assign(this, partial)
    this.status = OrderStatus.new
  }

  async toJSON() {
    return wrap<Order>(this).toObject() as OrderDto
  }
}

export interface OrderDto extends EntityDTO<Order> {}

export enum OrderPaymentType {
  cash = 'cash',
  online = 'online'
}
