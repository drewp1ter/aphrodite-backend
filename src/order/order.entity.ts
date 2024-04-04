import { Entity, PrimaryKey, EntityRepositoryType, Property, ManyToOne, ManyToMany, EntityDTO, Collection, wrap, types } from '@mikro-orm/core'
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
export class Order {
  [EntityRepositoryType]?: OrderRepository

  @PrimaryKey()
  id!: number

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

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date

  @Property()
  createdAt: Date

  // constructor(user: User, address: Address | null, comment: string, paymentType: OrderPaymentType) {
  constructor(partial: Pick<Order, 'user' | 'address' | 'comment' | 'paymentType'>) { 
    Object.assign(this, partial)
    this.status = OrderStatus.new
    this.createdAt = new Date()
    this.updatedAt = new Date()
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
