import { Module } from '@nestjs/common'
import { OrderService } from './order.service'
import { YookassaModule } from '../yookassa/yookassa.module'
import { DeliveryPriceModule } from '../delivery-price/delivery-price.module'
import { OrderController } from './order.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Address } from '../address/address.entity'
import { User } from '../user/user.entity'
import { Order } from './order.entity'
import { OrderItem } from '../order-item/order-item.entity'
import { Product } from '../product/product.entity'

@Module({
  controllers: [OrderController],
  providers: [OrderService],
  imports: [MikroOrmModule.forFeature({ entities: [Order, OrderItem, Address, User, Product] }), DeliveryPriceModule, YookassaModule]
})
export class OrderModule {}
