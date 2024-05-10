import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { YookassaService } from '../yookassa/yookassa.service'
import { OrderController } from './order.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Address } from '../address/address.entity'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import { OrderItem } from '../order-item/order-item.entity'
import { Product } from '../product/product.entity'

@Module({
  controllers: [OrderController],
  providers: [OrderService, YookassaService],
  imports: [MikroOrmModule.forFeature({ entities: [Order, OrderItem, Address, User, Product] })]
})
export class OrderModule {}
