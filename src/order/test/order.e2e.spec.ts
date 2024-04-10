import request from 'supertest'
import { faker } from '@faker-js/faker'
import { MikroORM } from '@mikro-orm/core'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { OrderSeeder } from '../../seeder/order.seeder'
import { Product } from '../../category/product/product.entity'
import { Order } from '../order.entity'

describe('Order', () => {
  let app: INestApplication
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

    await seeder.seed(OrderSeeder)
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
    expect(ordersCount).toBe(2)
    const createdOrder = await (await orm.em.findAll(Order, { populate: ['items', 'items.product.images'], orderBy: { id: 'DESC' }, limit: 1 }))
      .at(0)
      ?.toJSON()
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

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
