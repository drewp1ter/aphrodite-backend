import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { Role } from '../role/role.entity'
import { RoleEnum } from '../role/role.enum'
import { UserFactory } from '../../src/user/user.factory'

export class UsersSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    let adminRole = await em.findOne(Role, { role: RoleEnum.Admin })
    adminRole ??= new Role(RoleEnum.Admin)

    let userRole = await em.findOne(Role, { role: RoleEnum.User })
    userRole ??= new Role(RoleEnum.User)

    const admin = new UserFactory(em).makeEntity()
    admin.roles.set([userRole, adminRole])

    const user = new UserFactory(em).makeEntity()
    user.roles.add(userRole)

    em.persist([admin, user])
    await em.flush()
  }
}
