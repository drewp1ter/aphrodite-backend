import request from 'supertest'
import { faker } from '@faker-js/faker'
import { MikroORM } from '@mikro-orm/core'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../../mikro-orm.config'
import { AppModule } from '../../../app.module'
import { ProductSeeder } from '../../../seeder/product.seeder'
import { Product } from '../product.entity'

describe('Product', () => {
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

    await seeder.seed(ProductSeeder)
  })

  it('GET /products => should search products', async () => {
    const products = (await orm.em.findAll(Product, { populate: ['images'] })).map((product) => product.toJSON())
    const names = Array.from(
      new Set(
        products.reduce((prev: any, curr) => {
          prev.push(...curr.name.toLowerCase().split(' '))
          return prev
        }, [])
      )
    ).join(' ')
    const res = await request(app.getHttpServer()).get(`/products?query=${names}`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(products)
  })

  it('GET /categories/:categoryId/products => should return all products of category', async () => {
    const categoryId = 1
    const products = (await orm.em.findAll(Product, { populate: ['images'], where: { category: categoryId } })).map((product) => product.toJSON())
    const res = await request(app.getHttpServer()).get(`/categories/${categoryId}/products`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(products)
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
