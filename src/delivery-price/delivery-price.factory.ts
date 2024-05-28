import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { DeliveryPrice } from './delivery-price.entity'

export class DeliveryPriceFactory extends Factory<DeliveryPrice> {
  model = DeliveryPrice

  definition(): Partial<DeliveryPrice> {
    return {
      value: `${faker.location.country()}, ${faker.location.state()}, ${faker.location.city()}`,
      name: faker.location.city(),
      price: parseFloat(faker.commerce.price({ min: 100, max: 1000 }))
    }
  }
}
