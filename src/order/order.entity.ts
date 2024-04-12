import { Entity, EntityRepositoryType, Property, ManyToOne, OneToMany, EntityDTO, Collection, wrap, types } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { User } from '../user/user.entity'
import { Address } from '../address/address.entity'
import { OrderItem } from '../order-item/order-item.entity'
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

  constructor(partial: Partial<Order>) { 
    super()
    Object.assign(this, partial)
    this.status = OrderStatus.New
  }

  @ManyToOne({ hidden: true })
  customer!: User

  @ManyToOne({ nullable: true })
  address!: Address | null

  @OneToMany(() => OrderItem, item => item.order, { eager: true })
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
  get total(): string {
    const result = this.items.reduce((prev, item) => prev + (item.offeredPrice * item.amount) , 0)
    return result.toFixed(0)
  }

  toJSON() {
    const order = wrap<Order>(this).toObject() as OrderDto
    order.items = this.items.map(item => item.toJSON())
    return order
  }
}

export interface OrderDto extends EntityDTO<Order> {}
