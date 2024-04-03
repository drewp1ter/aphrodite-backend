import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'

import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Address } from '../address/address.entity'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import { OrderItem } from './order-item.entity'

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [MikroOrmModule.forFeature({ entities: [Order, OrderItem, Address, User] })]
})
export class OrderModule {}
