import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { OrderItem } from './order-item.entity'

export class OrderItemFactory extends Factory<OrderItem> {
  model = OrderItem

  definition(): Partial<OrderItem> {
    return {
      amount: faker.number.int({ min: 1, max: 10 }),
    }
  }
}
