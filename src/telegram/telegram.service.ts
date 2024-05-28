import { OnEvent } from '@nestjs/event-emitter'
import { LoggerService } from '../shared/services/logger.service'
import { Order } from '../order/order.entity'
import { OrderStatus } from '../order/order.interface'
import { config } from '../config'
import * as api from './telegram.api'
import { DeliveryPriceService } from '../delivery-price/delivery-price.service'
import { Inject } from '@nestjs/common'

export class TelegramService {
  logger = new LoggerService(TelegramService.name)

  constructor(@Inject(DeliveryPriceService) private readonly deliveryPriceService: DeliveryPriceService) {}

  @OnEvent('order.created')
  async handlePaymentByCash(order: Order) {
    if (order.paymentType !== 'cash') return
    this.logger.log(`Sending message started for order ${order.id}`)

    try {
      const text = await this.getTextFromOrder(order)
      let res: any
      res = await api.sendMessage(text, config.telegram.chatIdForOrderCreated)
      this.logger.log(JSON.stringify(res))
      res = await api.sendMessage(order.customer.phone, config.telegram.chatIdForOrderCreated)
      this.logger.log(JSON.stringify(res))
    } catch (e) {
      if (e instanceof Error || e instanceof SyntaxError) {
        this.logger.error(e.message, e)
        return
      }

      this.logger.error('Unknown error')
    }
  }

  @OnEvent('order.status_updated')
  async handlePaymentByOnline(order: Order) {
    if (order.status !== OrderStatus.Paid) return
    this.logger.log(`Sending message started for order ${order.id}`)

    try {
      const text = await this.getTextFromOrder(order)
      let res: any
      res = await api.sendMessage(text, config.telegram.chatIdForOrderConfirmed)
      this.logger.log(JSON.stringify(res))
      res = await api.sendMessage(order.customer.phone, config.telegram.chatIdForOrderCreated)
      this.logger.log(JSON.stringify(res))
    } catch (e) {
      if (e instanceof Error || e instanceof SyntaxError) {
        this.logger.error(e.message, e)
        return
      }

      this.logger.error('Unknown error')
    }
  }

  @OnEvent('order.confirmed')
  async handleOrderConfirmed(order: Order) {
    this.logger.log(`Sending message started for order ${order.id}`)
    try {
      const text = await this.getTextFromOrder(order)
      let res: any
      res = await api.sendMessage(text, config.telegram.chatIdForOrderConfirmed)
      this.logger.log(JSON.stringify(res))
      res = await api.sendMessage(order.customer.phone, config.telegram.chatIdForOrderCreated)
      this.logger.log(JSON.stringify(res))
    } catch (e) {
      if (e instanceof Error || e instanceof SyntaxError) {
        this.logger.error(e.message, e)
        return
      }

      this.logger.error('Unknown error')
    }
  }

  async getTextFromOrder(order: Order): Promise<string> {
    let deliveryPrice = 0
    if (order.address) {
      const existDeliveryPrice = await this.deliveryPriceService.findOneByName(order.address.city)
      deliveryPrice = existDeliveryPrice.price
    }

    const paymentTypeRU = {
      cash: 'наличными',
      online: 'онлайн'
    }

    if (order.address) {
      return (
        '```\n' +
        `Номер заказа:   ${order.id}\n` +
        `Имя:            ${order.customer.name}\n` +
        `Телефон:        ${order.customer.phone}\n` +
        `Доставка:       Да\n` +
        `Адрес доставки: ${order.address.city + ', ' + order.address.address}\n` +
        `Оплата:         ${paymentTypeRU[order.paymentType]}\n` +
        `Сумма заказа:   ${order.total}\n` +
        `Сумма доставки: ${deliveryPrice}\n` +
        `Итого:          ${parseFloat(order.total) + deliveryPrice}\n` +
        `Комментарий:    ${order.comment || ''}\n\n` +
        `Заказ:\n${order.items.map((item) => `${item.product.category.name}: ${item.product.name} * ${item.amount}\n`).join('')}` +
        '```'
      )
    }

    return (
      '```\n' +
      `Номер заказа:   ${order.id}\n` +
      `Имя:            ${order.customer.name}\n` +
      `Телефон:        ${order.customer.phone}\n` +
      `Доставка:       Нет\n` +
      `Оплата:         ${paymentTypeRU[order.paymentType]}\n` +
      `Итого:          ${order.total}\n` +
      `Комментарий:    ${order.comment || ''}\n\n` +
      `Заказ:\n${order.items.map((item) => `${item.product.category.name}: ${item.product.name} * ${item.amount}\n`).join('')}` +
      '```'
    )
  }
}
