import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { Order } from './order.entity'

export class OrderFactory extends Factory<Order> {
  model = Order

  definition(): Partial<Order> {
    return {
      comment: faker.lorem.words({ min: 0, max: 20 }),
      paymentType: [OrderPaymentType.Cash, OrderPaymentType.Online][faker.number.int({ max: 1 })]
    }
  }
}
