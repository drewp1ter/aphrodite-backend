import request from 'supertest'
import { MikroORM } from '@mikro-orm/core'
import { faker } from '@faker-js/faker'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { User } from '../../user/user.entity'
import { AppModule } from '../../app.module'
import { DeliveryPriceSeeder } from '../../seeder/delivery-price.seeder'
import { UsersSeeder } from '../../seeder/users.seeder'
import { DeliveryPriceFactory } from '../delivery-price.factory'
import { DeliveryPrice } from '../delivery-price.entity'

describe('DeliveryPrice', () => {
  let app: INestApplication
  let orm: Awaited<ReturnType<typeof MikroORM.init>>
  let jwtUser: string
  let jwtAdmin: string
  let admin: User
  let user: User

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
    await seeder.seed(DeliveryPriceSeeder)

    user = await orm.em.findOneOrFail(User, { name: 'user' })
    admin = await orm.em.findOneOrFail(User, { name: 'admin' })

    const jwtService = moduleRef.get(JwtService)
    jwtUser = jwtService.sign({ id: user.id, roles: user.roles.map((role) => role.role) })
    jwtAdmin = jwtService.sign({ id: admin.id, roles: admin.roles.map((role) => role.role) })
  })

  it('POST /delivery-prices => should create delivery prices from array', async () => {
    const amountToCreate = 5
    const deliveryPrices = new Array()

    for (let i = amountToCreate; i--; ) {
      deliveryPrices.push({
        value: `${faker.location.country()}, ${faker.location.state()}, ${faker.location.city()}`,
        name: faker.location.city(),
        price: parseFloat(faker.commerce.price({ min: 100, max: 1000 }))
      })
    }

    const res = await request(app.getHttpServer()).post('/delivery-prices').send({ deliveryPrices }).set('Authorization', `Bearer ${jwtAdmin}`)
    const deliveryPricesCount = await orm.em.count(DeliveryPrice)
    expect(res.status).toBe(201)
    expect(deliveryPricesCount).toBe(10 + amountToCreate)
  })

  it("POST /delivery-prices => shouldn't create delivery prices by unauthorized user", async () => {
    const res = await request(app.getHttpServer()).post('/delivery-prices').send({ deliveryPrices: [] })
    expect(res.status).toBe(401)
  })

  it("POST /delivery-prices => shouldn't create delivery prices by unprivileged user", async () => {
    const res = await request(app.getHttpServer()).post('/delivery-prices').send({ deliveryPrices: [] }).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(403)
  })

  it('DELETE /delivery-prices/:deliveryPriceId => should delete delivery price by id', async () => {
    const res = await request(app.getHttpServer()).delete('/delivery-prices/1').set('Authorization', `Bearer ${jwtAdmin}`)
    const deliveryPricesCount = await orm.em.count(DeliveryPrice)
    expect(res.status).toBe(200)
    expect(deliveryPricesCount).toBe(14)
  })

  it('DELETE /delivery-prices/:deliveryPriceId => should delete delivery price by id', async () => {
    const res = await request(app.getHttpServer()).delete('/delivery-prices/1').set('Authorization', `Bearer ${jwtAdmin}`)
    const deliveryPricesCount = await orm.em.count(DeliveryPrice)
    expect(res.status).toBe(200)
    expect(deliveryPricesCount).toBe(14)
  })

  it("DELETE /delivery-prices/:deliveryPriceId => unauthorized user can't delete delivery price by id", async () => {
    const res = await request(app.getHttpServer()).delete('/delivery-prices/1')
    expect(res.status).toBe(401)
  })

  it("DELETE /delivery-prices/:deliveryPriceId => unpriveleged user can't delete delivery price by id", async () => {
    const res = await request(app.getHttpServer()).delete('/delivery-prices/1').set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(403)
  })

  it('PATCH /delivery-prices/:deliveryPriceId => should update delivery price by id', async () => {
    const res = await request(app.getHttpServer())
      .patch('/delivery-prices/2')
      .send({ value: 'updated value', name: 'updated name', price: 99 })
      .set('Authorization', `Bearer ${jwtAdmin}`)
    
    const updatedDeliveryPrice = await orm.em.findOneOrFail(DeliveryPrice, { id: 2 })
    expect(res.status).toBe(200)
    expect(updatedDeliveryPrice.value).toBe('updated value')
    expect(updatedDeliveryPrice.name).toBe('updated name')
    expect(updatedDeliveryPrice.price).toBe(99)
  })

  it('PATCH /delivery-prices/:deliveryPriceId => unauthorized user can\'t update delivery price by id', async () => {
    const res = await request(app.getHttpServer())
      .patch('/delivery-prices/2')
      .send({ value: 'updated value', name: 'updated name', price: 99 })
    
    expect(res.status).toBe(401)
  })

  it('PATCH /delivery-prices/:deliveryPriceId => unpreveleged user can\'t update delivery price by id', async () => {
    const res = await request(app.getHttpServer())
      .patch('/delivery-prices/2')
      .send({ value: 'updated value', name: 'updated name', price: 99 })
      .set('Authorization', `Bearer ${jwtUser}`)
    
    expect(res.status).toBe(403)
  })

  it('GET /delivery-prices => should return all delivery prices', async () => {
    const res = await request(app.getHttpServer()).get('/delivery-prices')

    expect(res.status).toBe(200)
    expect(res.body).toHaveLength(14)

    res.body.forEach(item => {
      expect(item).toEqual({
        id: expect.anything(),
        name: expect.anything(),
        value: expect.anything(),
        price: expect.anything(),
        updatedAt: expect.anything(),
        createdAt: expect.anything()
      })
    })
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
