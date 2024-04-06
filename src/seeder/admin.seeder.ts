import { EntityManager } from '@mikro-orm/core'
import { Seeder } from '@mikro-orm/seeder'
import { User } from '../user/user.entity'
import { Role } from '../user/role/role.entity'
import { Role as RoleEnum } from '../user/role/role.enum'

const { ADMIN_EMAIL, ADMIN_PHONE, ADMIN_PASSWORD } = process.env

export class AdminSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    let adminRole = await em.findOne(Role, { role: RoleEnum.Admin })
    adminRole ??= new Role(RoleEnum.Admin)

    let userRole = await em.findOne(Role, { role: RoleEnum.User })
    userRole ??= new Role(RoleEnum.User)

    const defaultAdmin: Partial<User> = {
      name: 'admin',
      email: 'dev@dev.io',
      password: 'dev',
      phone: '+79990000000'
    }

    const user = new User(
      Object.assign<Partial<User>, Partial<User>>(defaultAdmin, {
        email: ADMIN_EMAIL,
        phone: ADMIN_PHONE,
        password: ADMIN_PASSWORD
      })
    )

    user.roles.set([userRole, adminRole])

    await em.persistAndFlush(user)
  }
}
