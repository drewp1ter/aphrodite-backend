import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { User } from '../../src/user/user.entity'
import { Address } from '../../src/address/address.entity'

export class TestSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const user = em.create(User, {
      username: 'John Snow',
      email: 'snow@wall.st',
      password: 'snow@wall.st',
      phone: '+79991234567',
      createdAt: new Date(),
      updatedAt: new Date()
    })

    em.persist(user)

    // const address = em.create(Address, {
    //   city: 'Los Santos',
      
    // })
  }
}
