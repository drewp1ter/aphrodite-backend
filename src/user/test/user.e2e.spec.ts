import request from 'supertest'
import { MikroORM } from '@mikro-orm/core'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { UsersSeeder } from '../../seeder/users.seeder'
import { User } from '../../user/user.entity'

describe('User', () => {
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

  it('GET /user => should return autentificated user info', async () => {
    const res = await request(app.getHttpServer()).get('/user').set('Authorization', `Bearer ${jwt}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      roles: ['user', 'admin']
    })
  })

  it('GET /user => should return unauthorized error', async () => {
    const res = await request(app.getHttpServer()).get('/user').set('Authorization', `Bearer bad${jwt}`)
    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401
    })
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
