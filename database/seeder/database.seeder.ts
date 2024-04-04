import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { UserFactory } from '../../src/user/user.factory'
import { AddressFactory } from '../../src/address/address.factory'
import { ProductFactory, ProductGroupFactory } from '../../src/product/product.factory'
import { OrderFactory } from '../../src/order/order.factory'
export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = new UserFactory(em)
      .each((user) => {
        user.addresses.set(new AddressFactory(em).make(3))
      })
      .makeOne()

    const productGroups = new ProductGroupFactory(em)
      .each((productGroup) => {
        productGroup.products.set(new ProductFactory(em).make(15))
      })
      .make(5)

    new OrderFactory(em)
      .each(async (order) => {
        order.user = user
        order.address = await new AddressFactory(em).createOne()

        for (let i = 0; i < 5; i++) {
          const groupIdx = faker.number.int({ max: productGroups.length - 1 })
          const productIdx = faker.number.int({ max: productGroups[groupIdx].products.length - 1 })
          order.products.add(productGroups[groupIdx].products[productIdx])
        }
      })
      .make(3)

      await em.flush()
  }
}
