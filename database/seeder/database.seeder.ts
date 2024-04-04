import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { User } from '../../src/user/user.entity'
import { Address } from '../../src/address/address.entity'
import { Product } from '../../src/product/product.entity'
import { ProductGroup } from '../../src/product/product-group.entity'

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = em.create(User, {
      name: 'John Snow',
      email: 'snow@wall.st',
      password: 'snow@wall.st',
      phone: '+79991234567',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    em.persistAndFlush(user)

    const address = em.create(Address, {
      city: 'Los Santos',
      address: 'Groove Street',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    em.persistAndFlush(address)

    const productGroup = em.create(ProductGroup, {
      name: 'Pizza',
      description: '',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    em.persistAndFlush(productGroup)

    const product = em.create(Product, {
      group: productGroup,
      name: 'Pizza',
      description: 'Tasty Pizza',
      squirrels: 123,
      fats: 231,
      carbohydrates: 555,
      calories: 150,
      flags: 0,
      price: 550,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    em.persistAndFlush(product)
  }
}
