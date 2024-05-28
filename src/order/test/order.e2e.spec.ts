import request from 'supertest'
import MockDate from 'mockdate'
import { faker } from '@faker-js/faker'
import { MikroORM } from '@mikro-orm/core'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { OrderSeeder } from '../../seeder/order.seeder'
import { DeliveryPriceSeeder } from '../../seeder/delivery-price.seeder'
import { Product } from '../../product/product.entity'
import { Order } from '../order.entity'
import { OrderStatus } from '../order.interface'
import { User } from '../../user/user.entity'
import { OrderItem } from '../../order-item/order-item.entity'
import { Address } from '../../address/address.entity'
import { DeliveryPrice } from '../../delivery-price/delivery-price.entity'

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

    await seeder.seed(DeliveryPriceSeeder)
    await seeder.seed(OrderSeeder)
    user = await orm.em.findOneOrFail(User, { name: 'user' })
    admin = await orm.em.findOneOrFail(User, { name: 'admin' })

    const jwtService = moduleRef.get(JwtService)
    jwtUser = jwtService.sign({ id: user.id, roles: user.roles.map((role) => role.role) })
    jwtAdmin = jwtService.sign({ id: admin.id, roles: admin.roles.map((role) => role.role) })

    const dummyFetch: any = () => ({ ok: true, status: 200, json: async () => ({}) })
    jest.spyOn(global, 'fetch').mockImplementation(dummyFetch)
  })

  it('POST /orders => should create the new order', async () => {
    const products = await orm.em.findAll(Product, { limit: 3 })
    const deliveryPrice = await orm.em.findOneOrFail(DeliveryPrice, { id: 1 })
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'cash',
        address: {
          city: deliveryPrice.name,
          address: faker.location.streetAddress()
        },
        items: products.map((product, idx) => ({ productId: product.id, amount: idx + 1 }))
      })
    const ordersCount = await orm.em.count(Order)
    expect(res.status).toBe(201)
    expect(ordersCount).toBe(3)
    expect(res.body).toEqual({
      redirectUrl: expect.anything()
    })
  })

  it("POST /orders => shouldn't create the new order with night time", async () => {
    MockDate.set('2024-05-24 5:00')
    const products = await orm.em.findAll(Product, { where: { category: { additionalInfo: { $ne: '' } } } })
    const deliveryPrice = await orm.em.findOneOrFail(DeliveryPrice, { id: 1 })
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'cash',
        address: {
          city: deliveryPrice.name,
          address: faker.location.streetAddress()
        },
        items: products.map((product, idx) => ({ productId: product.id, amount: idx + 1 }))
      })
    const ordersCount = await orm.em.count(Order)
    expect(res.status).toBe(503)
    expect(ordersCount).toBe(3)
    expect(res.body).toEqual({
      error: 'Service Unavailable',
      message: expect.anything(),
      statusCode: 503
    })

    MockDate.reset()
  })

  it("POST /orders => shouldn't create the new order on weekend", async () => {
    MockDate.set('2024-05-25 15:00')
    const products = await orm.em.findAll(Product, { where: { category: { additionalInfo: { $ne: '' } } } })
    const deliveryPrice = await orm.em.findOneOrFail(DeliveryPrice, { id: 1 })
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'cash',
        address: {
          city: deliveryPrice.name,
          address: faker.location.streetAddress()
        },
        items: products.map((product, idx) => ({ productId: product.id, amount: idx + 1 }))
      })
    const ordersCount = await orm.em.count(Order)
    expect(res.status).toBe(503)
    expect(ordersCount).toBe(3)
    expect(res.body).toEqual({
      error: 'Service Unavailable',
      message: expect.anything(),
      statusCode: 503
    })

    MockDate.reset()
  })

  it('POST /orders => should create the new order without address', async () => {
    const products = await orm.em.findAll(Product, { limit: 3 })
    const res = await request(app.getHttpServer())
      .post('/orders')
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'cash',
        items: products.map((product, idx) => ({ productId: product.id, amount: idx + 1 }))
      })
    const ordersCount = await orm.em.count(Order)
    expect(res.status).toBe(201)
    expect(ordersCount).toBe(4)
    expect(res.body).toEqual({
      redirectUrl: expect.anything()
    })
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
      message: 'Ошибка валидации, пожалуйста проверьте введенные вами данные',
      errors: {
        'amount.isPositive': 'amount must be a positive number'
      }
    })
  })

  it("POST /orders => shouldn't create the new order with bad productId", async () => {
    const deliveryPrice = await orm.em.findOneOrFail(DeliveryPrice, { id: 1 })
    const res = await request(app.getHttpServer())
      .post(`/orders`)
      .send({
        phone: faker.helpers.fromRegExp('+79[0-9]{9}'),
        name: faker.person.fullName(),
        comment: faker.lorem.words(8),
        paymentType: 'online',
        address: {
          city: deliveryPrice.name,
          address: faker.location.streetAddress()
        },
        items: [{ productId: 999, amount: 1 }]
      })
    expect(res.body).toEqual({
      error: 'Bad Request',
      message: 'Продукт не найден.',
      statusCode: 400
    })
    expect(res.status).toBe(400)
  })

  it('GET /orders/my => should get user orders', async () => {
    const res = await request(app.getHttpServer()).get(`/orders/my`).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(200)
    const userOrders = (await orm.em.findAll(Order, { where: { customer: user }, orderBy: { id: 'DESC' }, populate: ['address'] })).map((order) =>
      order.toJSON()
    )
    expect(userOrders.length).toBe(2)
    expect(res.body.orders).toEqual([
      {
        address: {
          address: userOrders[0].address!.address,
          city: userOrders[0].address!.city,
          createdAt: expect.anything(),
          id: userOrders[0].address!.id,
          updatedAt: expect.anything()
        },
        comment: userOrders[0].comment,
        createdAt: expect.anything(),
        id: userOrders[0].id,
        items: [
          {
            amount: userOrders[0].items[0].amount,
            offeredPrice: userOrders[0].items[0].offeredPrice,
            product: {
              calories: userOrders[0].items[0].product.calories,
              carbohydrates: userOrders[0].items[0].product.carbohydrates,
              createdAt: expect.anything(),
              description: userOrders[0].items[0].product.description,
              additionalInfo: expect.anything(),
              fats: userOrders[0].items[0].product.fats,
              flags: userOrders[0].items[0].product.flags,
              id: userOrders[0].items[0].product.id,
              images: [
                {
                  createdAt: expect.anything(),
                  id: userOrders[0].items[0].product.images[0].id,
                  type: userOrders[0].items[0].product.images[0].type,
                  updatedAt: expect.anything(),
                  url: userOrders[0].items[0].product.images[0].url
                }
              ],
              name: userOrders[0].items[0].product.name,
              price: userOrders[0].items[0].product.price,
              proteins: userOrders[0].items[0].product.proteins,
              weight: userOrders[0].items[0].product.weight,
              measureUnit: userOrders[0].items[0].product.measureUnit,
              updatedAt: expect.anything()
            }
          }
        ],
        paymentType: userOrders[0].paymentType,
        total: userOrders[0].total,
        updatedAt: expect.anything()
      },
      userOrders[1]
    ])
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
    const userOrder = (await orm.em.findOneOrFail(Order, { id: 1, customer: user })).toJSON()
    expect(res.body).toEqual({
      address: {
        address: userOrder.address!.address,
        city: userOrder.address!.city,
        createdAt: expect.anything(),
        id: userOrder.address!.id,
        updatedAt: expect.anything()
      },
      comment: userOrder.comment,
      createdAt: expect.anything(),
      id: userOrder.id,
      items: [
        {
          amount: userOrder.items[0].amount,
          offeredPrice: userOrder.items[0].offeredPrice,
          product: {
            calories: userOrder.items[0].product.calories,
            carbohydrates: userOrder.items[0].product.carbohydrates,
            createdAt: expect.anything(),
            description: userOrder.items[0].product.description,
            additionalInfo: expect.anything(),
            fats: userOrder.items[0].product.fats,
            flags: userOrder.items[0].product.flags,
            id: userOrder.items[0].product.id,
            images: [
              {
                createdAt: expect.anything(),
                id: userOrder.items[0].product.images[0].id,
                type: userOrder.items[0].product.images[0].type,
                updatedAt: expect.anything(),
                url: userOrder.items[0].product.images[0].url
              }
            ],
            name: userOrder.items[0].product.name,
            price: userOrder.items[0].product.price,
            proteins: userOrder.items[0].product.proteins,
            weight: userOrder.items[0].product.weight,
            measureUnit: userOrder.items[0].product.measureUnit,
            updatedAt: expect.anything()
          }
        }
      ],
      paymentType: userOrder.paymentType,
      total: userOrder.total,
      updatedAt: expect.anything()
    })
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
    const orderId = 1
    const amount = 16
    const productId = 2
    const res = await request(app.getHttpServer()).post(`/orders/${orderId}`).send({ productId, amount }).set('Authorization', `Bearer ${jwtAdmin}`)
    expect(res.status).toBe(201)
    expect(await orm.em.count(OrderItem, { order: orderId })).toBe(2)
    expect(await orm.em.count(OrderItem, { order: orderId, amount })).toBe(1)
  })

  it("POST /orders/:orderId => shouldn't add product by user", async () => {
    const orderId = 1
    const amount = 16
    const productId = 2
    const res = await request(app.getHttpServer()).post(`/orders/${orderId}`).send({ productId, amount }).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(403)
    expect(res.body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403
    })
  })

  it("POST /orders/:orderId => shouldn't add product by user", async () => {
    const orderId = 1
    const amount = 16
    const productId = 2
    const res = await request(app.getHttpServer()).post(`/orders/${orderId}`).send({ productId, amount }).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(403)
    expect(res.body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403
    })
  })

  it('DELETE /orders/:orderId/:productId => should delete product by admin', async () => {
    const orderId = 1
    const productId = 1
    const res = await request(app.getHttpServer()).delete(`/orders/${orderId}/${productId}`).set('Authorization', `Bearer ${jwtAdmin}`)
    expect(res.status).toBe(200)
  })

  it("DELETE /orders/:orderId/:productId => shouldn't delete product by user", async () => {
    const orderId = 1
    const productId = 1
    const res = await request(app.getHttpServer()).delete(`/orders/${orderId}/${productId}`).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(403)
    expect(res.body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403
    })
  })

  it('DELETE /orders/:orderId => should delete order by admin', async () => {
    const orderId = 1
    const addressCount = await orm.em.count(Address)
    const userCount = await orm.em.count(User)
    const res = await request(app.getHttpServer()).delete(`/orders/${orderId}`).set('Authorization', `Bearer ${jwtAdmin}`)
    expect(res.status).toBe(200)
    expect(await orm.em.count(OrderItem, { order: orderId })).toBe(0)
    expect(await orm.em.count(Address)).toBe(addressCount)
    expect(await orm.em.count(User)).toBe(userCount)
  })

  it("DELETE /orders/:orderId => shouldn't delete order by user", async () => {
    const orderId = 2
    const res = await request(app.getHttpServer()).delete(`/orders/${orderId}`).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(403)
    expect(res.body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403
    })
  })

  it('PATCH /orders/confirm/:orderId => should update order status by admin', async () => {
    const orderId = 3
    const notConfirmed = await orm.em.count(Order, { id: orderId, status: OrderStatus.New })
    expect(notConfirmed).toBe(1)
    const res = await request(app.getHttpServer()).patch(`/orders/confirm/${orderId}`).set('Authorization', `Bearer ${jwtAdmin}`)
    expect(res.status).toBe(200)
    const confirmed = await orm.em.count(Order, { id: orderId, status: OrderStatus.Confirmed })
    expect(confirmed).toBe(1)
  })

  it("PATCH /orders/confirm/:orderId => shouldn't update order status by user", async () => {
    const orderId = 3
    const res = await request(app.getHttpServer()).patch(`/orders/confirm/${orderId}`).set('Authorization', `Bearer ${jwtUser}`)
    expect(res.status).toBe(403)
    expect(res.body).toEqual({
      error: 'Forbidden',
      message: 'Forbidden resource',
      statusCode: 403
    })
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()

    jest.restoreAllMocks()
  })
})
