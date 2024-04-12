import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { UserFactory } from '../../src/user/user.factory'
import { AddressFactory } from '../address/address.factory'
import { ProductFactory } from '../product/product.factory'
import { CategoryFactory } from '../category/category.factory'
import { OrderFactory } from '../order/order.factory'
import { ProductImageFactory } from '../product-image/product-image.factory'
import { Role } from '../role/role.entity'
import { RoleEnum } from '../role/role.enum'
import { OrderItem } from '../order-item/order-item.entity'

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roleUser = new Role(RoleEnum.User)
    const roleAdmin = new Role(RoleEnum.Admin)

    em.persist(roleAdmin).persist(roleUser)

    const user = new UserFactory(em)
      .each((user) => {
        user.addresses.set(new AddressFactory(em).make(3))
        user.roles.add(roleUser)
      })
      .makeOne()

    const category = new CategoryFactory(em)
      .each((category) => {
        category.products.set(
          new ProductFactory(em)
            .each((product) => {
              product.images.add(new ProductImageFactory(em).makeOne())
            })
            .make(15)
        )
      })
      .make(5)

    new OrderFactory(em)
      .each(async (order) => {
        order.customer = user
        order.address = await new AddressFactory(em).createOne()

        for (let i = 0; i < 3; i++) {
          const productIdx = faker.number.int({ max: category[i].products.length - 1 })
          order.items.add(new OrderItem({ product: category[i].products[productIdx], amount: i, order, offeredPrice: category[i].products[productIdx].price }))
        }
      })
      .make(3)

    await em.flush()
  }
}
