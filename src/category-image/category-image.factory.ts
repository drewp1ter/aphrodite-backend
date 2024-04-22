import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { CategoryImage } from './category-image.entity'

export class CategoryImageFactory extends Factory<CategoryImage> {
  model = CategoryImage

  definition(): Partial<CategoryImage> {
    return {
      url: faker.image.urlPicsumPhotos({ width: 395, height: 212, grayscale: false }),
      type: 'preview'
    }
  }
}
