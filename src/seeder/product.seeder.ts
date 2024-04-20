import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { ProductFactory } from '../product/product.factory'
import { CategoryFactory } from '../category/category.factory'
import { ProductImageFactory } from '../product-image/product-image.factory'
import { CategoryImageFactory } from '../category-image/category-image.factory'

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
        category.images.add(new CategoryImageFactory(em).makeOne())
      })
      .make(3)

    await em.flush()
  }
}
