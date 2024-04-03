import { EntityRepository } from '@mikro-orm/mysql'
import { Order } from './order.entity'

export class OrderRepository extends EntityRepository<Order> {}
