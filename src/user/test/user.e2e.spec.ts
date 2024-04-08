import request from 'supertest'
import { MikroORM } from '@mikro-orm/core'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { UsersSeeder } from '../../seeder/users.seeder'
import { User } from '../user.entity'

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

  it('POST /users => should create new user', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: { name: 'user', phone: '+79991234567', password: 'qwerty123', email: 'test@test.com' } })
    expect(res.status).toBe(201)
  })

  it('POST /users => should return bad password, name, phone and email errors', async () => {
    const res = await request(app.getHttpServer())
      .post('/users')
      .send({ user: { name: '', phone: '+91234567', password: '', email: '' } })
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

  it('GET users/me => should return autentificated user info', async () => {
    const res = await request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer ${jwt}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual({
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      token: jwt
    })
  })

  it('GET users/me => should return unauthorized error', async () => {
    const res = await request(app.getHttpServer()).get('/users/me').set('Authorization', `Bearer bad${jwt}`)
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
