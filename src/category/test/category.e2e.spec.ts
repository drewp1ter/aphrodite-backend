import request from 'supertest'
import { MikroORM } from '@mikro-orm/core'
import { Test } from '@nestjs/testing'
import { INestApplication } from '@nestjs/common'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { ProductSeeder } from '../../seeder/product.seeder'
import { Category } from '../category.entity'

describe('Category', () => {
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

  it('GET /categories => should return list of categories', async () => {
    const categories = (await orm.em.findAll(Category)).map((category) => category.toJSON())
    const res = await request(app.getHttpServer()).get(`/categories`)
    expect(res.status).toBe(200)
    expect(res.body).toEqual(categories)
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
