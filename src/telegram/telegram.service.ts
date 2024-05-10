import { OnEvent } from '@nestjs/event-emitter'
import { Order } from '../order/order.entity'
import { OrderStatus } from '../order/order.interface'
import * as api from './telegram.api'

export class TelegramService {
  @OnEvent('order.created')
  async handlePaymentByCash(order: Order) {
    if (order.paymentType !== 'cash') return

    const text = this.getTextFromOrder(order)
    await api.sendMessage(text)
  }

  @OnEvent('order.status_updated')
  async handlePaymentByOnline(order: Order) {
    if (order.status !== OrderStatus.Paid) return

    const text = this.getTextFromOrder(order)
    await api.sendMessage(text)
  }

  getTextFromOrder(order: Order): string {
    const paymentTypeRU = {
      cash: 'наличными',
      online: 'онлайн'
    }

    return (
      '```\n' +
      `Номер заказа:   ${order.id}\n` +
      `Имя:            ${order.customer.name}\n` +
      `Телефон:        ${order.customer.phone}\n` +
      `Адрес доставки: ${order.address?.city + ' ' + order.address?.address}\n` +
      `Сумма заказа:   ${order.total}\n` +
      `Оплата:         ${paymentTypeRU[order.paymentType]}\n` +
      `Комментарий:    ${order.comment || ''}\n\n` +
      `Заказ:\n${order.items.map((item) => `${item.product.category.name}: ${item.product.name} * ${item.amount}\n`).join('')}` +
      '```'
    )
  }
}
