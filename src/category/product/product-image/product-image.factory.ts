import { Factory } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { ProductImage } from './product-image.entity'

export class ProductImageFactory extends Factory<ProductImage> {
  model = ProductImage

  definition(): Partial<ProductImage> {
    return {
      url: faker.image.urlPicsumPhotos({ width: 395, height: 212, grayscale: false }),
      type: 'preview'
    }
  }
}
