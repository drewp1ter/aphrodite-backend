import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { faker } from '@faker-js/faker'
import { UserFactory } from '../../src/user/user.factory'
import { AddressFactory } from '../address/address.factory'
import { ProductFactory } from '../category/product/product.factory'
import { CategoryFactory } from '../category/category.factory'
import { OrderFactory } from '../order/order.factory'
import { ProductImageFactory } from '../category/product/product-image/product-image.factory'
import { Role } from '../auth/role/role.entity'
import { Role as RoleEnum } from '../auth/role/role.enum'

export class OrderSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roleUser = new Role(RoleEnum.User)
    const roleAdmin = new Role(RoleEnum.Admin)

    em.persist(roleAdmin).persist(roleUser)

    const user = new UserFactory(em)
      .each((user) => {
        user.addresses.add(new AddressFactory(em).makeOne())
        user.roles.add(roleUser)
      })
      .makeOne({ name: 'user' })

    new UserFactory(em)
      .each((user) => {
        user.roles.add(roleAdmin)
      })
      .makeOne({ name: 'admin' })  

    const category = new CategoryFactory(em)
      .each((category) => {
        category.products.set(
          new ProductFactory(em)
            .each((product) => {
              product.images.add(new ProductImageFactory(em).makeOne())
            })
            .make(3, { price: 5.99 })
        )
      })
      .makeOne()

    new OrderFactory(em)
      .each(async (order) => {
        order.user = user
        order.address = await new AddressFactory(em).createOne()
        order.products.add(category.products[0])
      })
      .makeOne()
  }
}
