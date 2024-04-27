import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'

@Module({
  controllers: [],
  providers: [TelegramService],
  imports: []
})
export class TelegramModule {}