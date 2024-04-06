import { Entity, EntityRepositoryType, Property, ManyToOne, ManyToMany, EntityDTO, Collection, wrap, types } from '@mikro-orm/core'
import { BaseEntity } from '../shared/entities/base.entity'
import { User } from '../user/user.entity'
import { Product } from '../category/product/product.entity'
import { Address } from '../address/address.entity'
import { OrderItem } from './order-item.entity'
import { OrderRepository } from './order.repository'
@Entity({ repository: () => OrderRepository })
export class Order extends BaseEntity {
  [EntityRepositoryType]?: OrderRepository

  constructor(partial: Pick<Order, 'user' | 'address' | 'comment' | 'paymentType'>) { 
    super()
    Object.assign(this, partial)
    this.status = OrderStatus.New
  }

  @ManyToOne({ hidden: true })
  user!: User

  @ManyToOne({ nullable: true, hidden: true })
  address!: Address | null

  @ManyToMany({ entity: () => Product, pivotEntity: () => OrderItem })
  products = new Collection<Product>(this)

  @Property({ default: OrderStatus.New, hidden: true })
  status: OrderStatus

  @Property({ type: types.text, nullable: true })
  comment!: string

  @Property()
  paymentType!: OrderPaymentType

  @Property({ default: '' })
  confirmationToken!: string

  async toJSON() {
    return wrap<Order>(this).toObject() as OrderDto
  }
}

export interface OrderDto extends EntityDTO<Order> {}
