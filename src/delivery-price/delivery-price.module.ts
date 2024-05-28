import { Module } from '@nestjs/common'
import { DeliveryPriceService } from './delivery-price.service'
import { DeliveryPriceController } from './delivery-price.controller'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { DeliveryPrice } from './delivery-price.entity'

@Module({
  controllers: [DeliveryPriceController],
  providers: [DeliveryPriceService],
  imports: [MikroOrmModule.forFeature({ entities: [DeliveryPrice] })],
  exports: [DeliveryPriceService]
})
export class DeliveryPriceModule {}
