import { OnEvent } from '@nestjs/event-emitter'
import { Order } from '../order/order.entity'

export class TelegramService {
  @OnEvent('order.created')
  async handleOrderCreatedEvent(payload: Order) {
    console.log(payload)
  }
}
