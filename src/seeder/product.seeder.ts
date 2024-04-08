import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { ProductFactory } from '../category/product/product.factory'
import { CategoryFactory } from '../category/category.factory'
import { ProductImageFactory } from '../category/product/product-image/product-image.factory'

export class ProductSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new CategoryFactory(em)
      .each((category) => {
        category.products.set(
          new ProductFactory(em)
            .each((product) => {
              product.images.add(new ProductImageFactory(em).makeOne())
            })
            .make(3)
        )
      })
      .make(3)

    await em.flush()
  }
}
