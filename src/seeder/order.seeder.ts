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
import { RoleEnum } from '../auth/role/role.enum'
import { OrderItemFactory } from '../order/order-item.factory'

export class OrderSeeder extends Seeder {
  async run(gem: EntityManager): Promise<void> {
    return gem.transactional(async (em) => {
      let roleUser = await em.findOne(Role, { role: RoleEnum.User })
      roleUser ??= new Role(RoleEnum.User)

      let roleAdmin = await em.findOne(Role, { role: RoleEnum.User })!
      roleAdmin ??= new Role(RoleEnum.Admin)

      em.persist([roleAdmin, roleUser])

      const user = new UserFactory(em)
        .each((user) => {
          user.addresses.add(new AddressFactory(em).makeOne())
          user.roles.add(roleUser!)
        })
        .makeOne({ name: 'user' })

      const admin = new UserFactory(em)
        .each((user) => {
          user.roles.add(roleAdmin!)
        })
        .makeOne({ name: 'admin' })

      em.persist([user, admin])

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

      em.persist(category)

      let i = 0

      const order = new OrderFactory(em)
        .each(async (order) => {
          const product = category.products[i++]
          order.customer = user
          order.address = await new AddressFactory(em).createOne()
          order.items.add(new OrderItemFactory(em).makeOne({ offeredPrice: product.price, product }))
        })
        .make(2)
        
      await em.persist(order).flush()
    })
  }
}
