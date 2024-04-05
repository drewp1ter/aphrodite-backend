import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { Product } from './product.entity'

export class ProductFactory extends Factory<Product> {
  model = Product

  definition(): Partial<Product> {
    return {
      name: faker.commerce.product(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 2000 })),
      squirrels: faker.number.int({ max: 1000 }),
      fats: faker.number.int({ max: 1000 }),
      carbohydrates: faker.number.int({ max: 1000 }),
      flags: faker.number.int({ max: 7 }),
      calories: faker.number.int({ max: 1000 })
    }
  }
}
