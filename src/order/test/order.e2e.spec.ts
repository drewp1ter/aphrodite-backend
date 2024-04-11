import request from 'supertest'
import { faker } from '@faker-js/faker'
import { MikroORM } from '@mikro-orm/core'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { OrderSeeder } from '../../seeder/order.seeder'
import { Product } from '../../category/product/product.entity'
import { Order } from '../order.entity'
import { User } from '../../user/user.entity'

describe('Order', () => {
  let app: INestApplication
  let orm: Awaited<ReturnType<typeof MikroORM.init>>
  let jwtUser: string
  let jwtAdmin: string
  let user: User
  let admin: User

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

    await seeder.seed(OrderSeeder)
    user = await orm.em.findOneOrFail(User, { name: 'user' })
    admin = await orm.em.findOneOrFail(User, { name: 'admin' })

    const jwt_service = moduleRef.get(JwtService)
    jwtUser = jwt_service.sign({ id: user.id, roles: user.roles.map((role) => role.role) })
    jwtAdmin = jwt_service.sign({ id: admin.id, roles: admin.roles.map((role) => role.role) })
  })

  it('POST /orders => should create the new order', async () => {
    const products = await orm.em.findAll(Product)
    const res = await request(app.getHttpServer())
      .post(`/orders`)
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'online',
        address: {
          city: faker.location.city(),
          address: faker.location.streetAddress()
        },
        items: products.map((product, idx) => ({ productId: product.id, amount: idx + 1 }))
      })
    const ordersCount = await orm.em.count(Order)
    expect(res.status).toBe(201)
    expect(ordersCount).toBe(3)
    const createdOrder = (await orm.em.findAll(Order)).at(-1)?.toJSON()
    expect(res.body).toEqual(createdOrder)
    expect(res.body.total.toString()).toBe('35.94')
  })

  it("POST /orders => shouldn't create the new order with bad item amount", async () => {
    const products = await orm.em.findAll(Product)
    const res = await request(app.getHttpServer())
      .post(`/orders`)
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'online',
        address: {
          city: faker.location.city(),
          address: faker.location.streetAddress()
        },
        items: products.map((product) => ({ productId: product.id, amount: 0 }))
      })
    expect(res.status).toBe(400)
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Item amount is incorrect.',
      statusCode: 400
    })
  })

  it("POST /orders => shouldn't create the new order with bad productId", async () => {
    const res = await request(app.getHttpServer())
      .post(`/orders`)
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'online',
        address: {
          city: faker.location.city(),
          address: faker.location.streetAddress()
        },
        items: [{ productId: 999, amount: 1 }]
      })
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Product not found.',
      statusCode: 400
    })
    expect(res.status).toBe(400)
  })

  it('GET /orders/my => should get user orders', async () => {
    const res = await request(app.getHttpServer()).get(`/orders/my`).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(200)
    const userOrders = await orm.em.findAll(Order, { where: { customer: user }, orderBy: { id: 'DESC' } })
    expect(userOrders.length).toBe(2)
    expect(res.body.orders).toEqual(userOrders.map((order) => order.toJSON()))
    expect(res.body.count).toBe(2)
  })

  it("GET /orders/my => shouldn't get any orders", async () => {
    const res = await request(app.getHttpServer()).get(`/orders/my`)
    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401
    })
  })

  it('GET /orders/:orderId => should get user order by id', async () => {
    const res = await request(app.getHttpServer()).get(`/orders/1`).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(200)
    const userOrder = await orm.em.findOneOrFail(Order, { id: 1, customer: user })
    expect(res.body).toEqual(userOrder.toJSON())
  })

  it("GET /orders/:orderId => shouldn't get order by id", async () => {
    const res = await request(app.getHttpServer()).get(`/orders/1`)
    expect(res.status).toBe(401)
    expect(res.body).toEqual({
      message: 'Unauthorized',
      statusCode: 401
    })
  })

  it('POST /orders/:orderId => should add product by admin', async () => {
    const res = await request(app.getHttpServer()).post(`/orders/1`).send({ productId: 3, amount: 1 }).set('Authorization', `Bearer ${jwtAdmin}`)
    // expect(res.status).toBe(201)
    expect(res.body).toEqual({})
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
