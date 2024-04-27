import { OnEvent } from '@nestjs/event-emitter'
import { Order } from '../order/order.entity'
import { config } from '../config'
export class TelegramService {
  @OnEvent('order.created')
  async handleOrderCreatedEvent(order: Order) {
    const text = '```\n' +
      `Номер заказа:   ${order.id}\n` +
      `Имя:            ${order.customer.name}\n` +
      `Телефон:        ${order.customer.phone}\n` +
      `Адрес доставки: ${order.address?.city + ' ' + order.address?.address}\n` +
      `Сумма заказа:   ${order.total}\n` +
      `Комментарий:    ${order.comment || ''}\n\n` +
      `Заказ:\n${order.items.map((item) => `${item.product.category.name}: ${item.product.name} * ${item.amount}\n`).join('')}` +
      '```'

    const res = await fetch(`https://api.telegram.org/bot${config.telegram.token}/sendMessage`, {
      method: 'POST',
      headers: { 
        'content-type': 'application/json', 
        accept: 'application/json' 
      },
      body: JSON.stringify({ chat_id: config.telegram.chatId, parse_mode: 'Markdown', text })
    })
  }
}
