import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { User } from '../user/user.entity'
import { Role } from '../role/role.entity'
import { RoleEnum } from '../role/role.enum'
import { config } from '../config'

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    let adminRole = await em.findOne(Role, { role: RoleEnum.Admin })
    adminRole ??= new Role(RoleEnum.Admin)

    let userRole = await em.findOne(Role, { role: RoleEnum.User })
    userRole ??= new Role(RoleEnum.User)

    const user = new User(config.admin)
    user.roles.set([userRole, adminRole])

    await em.persistAndFlush(user)
  }
}
