import { Entity, EntityRepositoryType, Property, ManyToOne, OneToMany, EntityDTO, Collection, wrap, types, LoadStrategy } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { User } from '../user/user.entity'
import { Product } from '../category/product/product.entity'
import { Address } from '../address/address.entity'
import { OrderItem } from './order-item.entity'
import { OrderRepository } from './order.repository'

export enum OrderPaymentType {
  Cash = 'cash',
  Online = 'online'
}

export enum OrderStatus {
  New = 'new',
  Payed = 'payed',
  Canceled = 'canceled',
  Confirmed = 'confirmed'
}

@Entity({ repository: () => OrderRepository })
export class Order extends BaseEntity {
  [EntityRepositoryType]?: OrderRepository

  constructor(partial: Pick<Order, 'customer' | 'address' | 'comment' | 'paymentType'>) { 
    super()
    Object.assign(this, partial)
    this.status = OrderStatus.New
  }

  @ManyToOne({ hidden: true })
  customer!: User

  @ManyToOne({ nullable: true, hidden: true })
  address!: Address | null

  @OneToMany(() => OrderItem, item => item.order)
  items = new Collection<OrderItem>(this)

  @Property({ default: OrderStatus.New, hidden: true })
  status: OrderStatus

  @Property({ type: types.text, nullable: true })
  comment!: string

  @Property()
  paymentType!: OrderPaymentType

  @Property({ default: '', hidden: true, lazy: true, index: true })
  confirmationToken!: string

  @Property({ persist: false })
  get total() {
    const result = this.items.reduce((prev, item) => prev + (item.offeredPrice * item.amount) , 0)
    return parseFloat(result.toFixed(2))
  }

  async toJSON() {
    const order = wrap<Order>(this).toObject() as OrderDto
    order.items = this.items.toJSON()
    return order
  }
}

export interface OrderDto extends EntityDTO<Order> {}
