import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { DeliveryPriceModule } from '../delivery-price/delivery-price.module'

@Module({
  controllers: [],
  providers: [TelegramService],
  imports: [DeliveryPriceModule],
  exports: [TelegramService]
})
export class TelegramModule {}
