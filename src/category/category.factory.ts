import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { Category } from './category.entity'

export class CategoryFactory extends Factory<Category> {
  model = Category

  definition(): Partial<Category> {
    return {
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription()
    }
  }
}
