import request from 'supertest'
import { faker } from '@faker-js/faker'
import { MikroORM } from '@mikro-orm/core'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { UsersSeeder } from '../../seeder/users.seeder'
import { User } from '../../user/user.entity'

describe('Auth', () => {
  let app: INestApplication
  let jwt: string
  let user: User
  let orm: Awaited<ReturnType<typeof MikroORM.init>>

  beforeAll(async () => {
    mikroConfig.allowGlobalContext = true
    orm = await MikroORM.init(mikroConfig)
    const seeder = orm.getSeeder()

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(MikroORM)
      .useValue(orm)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()

    await seeder.seed(UsersSeeder)
    const users = await orm.em.findAll(User, { limit: 1 })
    user = users[0]

    const jwt_service = moduleRef.get(JwtService)
    jwt = jwt_service.sign({ id: user.id, roles: ['user', 'admin'] })
  })

  it('POST /auth/sign-up => should create new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({
        user: {
          name: faker.person.fullName(),
          phone: '+79991234567',
          password: faker.internet.password({ length: 10 }),
          email: faker.internet.email()
        }
      })
    expect(res.body).toEqual({})
    expect(res.status).toBe(201)
  })

  it('POST /auth/sign-up => should return bad password, name, phone and email errors', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/sign-up')
      .send({ user: { name: '', phone: '', password: '', email: '' } })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      message: 'Input data validation failed',
      errors: {
        nameisNotEmpty: 'name should not be empty',
        emailisEmail: 'email must be an email',
        passwordisLength: 'password must be longer than or equal to 8 characters',
        phoneisPhoneNumber: 'phone must be a valid phone number'
      }
    })
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
