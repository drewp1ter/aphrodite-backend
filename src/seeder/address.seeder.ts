import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { UserFactory } from '../../src/user/user.factory'
import { AddressFactory } from '../address/address.factory'
import { Role } from '../role/role.entity'
import { RoleEnum } from '../role/role.enum'

export class AddressSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const roleUser = new Role(RoleEnum.User)
    const roleAdmin = new Role(RoleEnum.Admin)

    em.persist([roleAdmin, roleUser])

    new UserFactory(em)
      .each((user) => {
        user.addresses.set(new AddressFactory(em).make(2))
        user.roles.add(roleUser)
      })
      .makeOne()

    await em.flush()
  }
}
