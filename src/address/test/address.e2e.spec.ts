import request from 'supertest'
import { faker } from '@faker-js/faker'
import { MikroORM } from '@mikro-orm/core'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { AddressSeeder } from '../../seeder/address.seeder'
import { User } from '../../user/user.entity'
import { Address } from '../address.entity'

describe('Address', () => {
  let app: INestApplication
  let jwt
  let user: Partial<User>
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

    await seeder.seed(AddressSeeder)
    user = (await orm.em.findAll(User, { limit: 1 }))[0]
    const jwt_service = moduleRef.get(JwtService)
    jwt = jwt_service.sign({ id: user.id, roles: ['user'] })
  })

  it('POST /addresses => should create the new address and attach to user', async () => {
    const city = faker.location.city()
    const address = faker.location.streetAddress()
    const res = await request(app.getHttpServer()).post('/addresses').send({ address: { city, address } }).set('Authorization', `Bearer ${jwt}`)
    expect(res.status).toBe(201)
    await orm.em.refresh(user, { populate: ['addresses'] })
    expect(res.body).toEqual({
      id: expect.anything(),
      city,
      address,
      createdAt: expect.stringContaining('T'),
      updatedAt: expect.stringContaining('T')
    })
    const userAddress = user.addresses?.getItems().at(-1)?.toJSON()
    expect(userAddress).toEqual({
      id: expect.anything(),
      city,
      address,
      createdAt: expect.stringContaining('T'),
      updatedAt: expect.stringContaining('T')
    })
  })

  it("POST /addresses => shouldn't create the new address", async () => {
    const city = faker.location.city()
    const address = faker.location.streetAddress()
    const res = await request(app.getHttpServer()).post('/addresses').send({ address: { city, address } })
    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401
    })
  })

  it('GET /addresses => should return all user addresses', async () => {
    const res = await request(app.getHttpServer()).get('/addresses').set('Authorization', `Bearer ${jwt}`)
    expect(res.status).toBe(200)
    const userAddresses = (await orm.em.findAll(Address)).map(address => address.toJSON())
    expect(res.body).toEqual(userAddresses)
  })

  it('GET /addresses => shouldn\'t return all user addresses', async () => {
    const res = await request(app.getHttpServer()).get('/addresses')
    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401
    })
  })

  it('DELETE /addresses/:addressID => should delete user address', async () => {
    const res = await request(app.getHttpServer()).delete('/addresses/1').set('Authorization', `Bearer ${jwt}`)
    expect(res.status).toBe(200)
    await orm.em.refresh(user, { populate: ['addresses'] })
    const count = await orm.em.count(Address)
    expect(count).toBe(3)
    expect(user.addresses?.length).toBe(2)
    expect(res.status).toBe(200)
  })

  it('DELETE /addresses/:addressID => shouldn\'t delete user address', async () => {
    const res = await request(app.getHttpServer()).delete('/addresses/1')
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
