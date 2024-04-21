import { Test } from '@nestjs/testing'
import { fetchMock } from './fetchMock'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { INestApplication } from '@nestjs/common'
import { MikroORM } from '@mikro-orm/core'
import { IikoService } from '../iiko.service'
import { Category } from '../../category/category.entity'
import { Product } from '../../product/product.entity'
import { CategoryImage } from '../../category-image/category-image.entity'
import { ProductImage } from '../../product-image/product-image.entity'

describe('Testing the Iiko Service', () => {
  let app: INestApplication
  let orm: Awaited<ReturnType<typeof MikroORM.init>>
  let service: IikoService
  let spyFetch: any = undefined

  beforeAll(async () => {
    mikroConfig.allowGlobalContext = true
    orm = await MikroORM.init(mikroConfig)

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    })
      .overrideProvider(MikroORM)
      .useValue(orm)
      .compile()

    app = moduleRef.createNestApplication()
    await app.init()

    service = moduleRef.get<IikoService>(IikoService)
  })

  beforeEach(async () => {
    spyFetch = jest.spyOn(global, 'fetch').mockImplementation(fetchMock)
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('Should create categories and products', async () => {
    await service.syncProducts()
    expect(spyFetch).toHaveBeenCalledTimes(4)
    const categoriesCount = await orm.em.count(Category)
    const categoryProductCount1 = await orm.em.count(Product, { category: 1 })
    const categoryProductCount2 = await orm.em.count(Product, { category: 2 })
    const categoryImageCount1 = await orm.em.count(CategoryImage)
    const produtctImageCount1 = await orm.em.count(ProductImage)
    expect(categoriesCount).toBe(2)
    expect(categoryProductCount1).toBe(9)
    expect(categoryProductCount2).toBe(18)
    expect(categoryImageCount1).toBe(1)
    expect(produtctImageCount1).toBe(21)
  })

  it('Should add category and product and exist items shouldn\'t be changed', async () => {
    await service.syncProducts()
    expect(spyFetch).toHaveBeenCalledTimes(1)
    const categoriesCount = await orm.em.count(Category, { isDeleted: false })
    const categoryProductCount1 = await orm.em.count(Product, { category: 1, isDeleted: false })
    const categoryProductCount2 = await orm.em.count(Product, { category: 2, isDeleted: false })
    const categoryProductCount3 = await orm.em.count(Product, { category: 3, isDeleted: false })
    const categoryImageCount1 = await orm.em.count(CategoryImage)
    const produtctImageCount1 = await orm.em.count(ProductImage)
    expect(categoriesCount).toBe(3)
    expect(categoryProductCount1).toBe(9)
    expect(categoryProductCount2).toBe(18)
    expect(categoryProductCount3).toBe(1)
    expect(categoryImageCount1).toBe(1)
    expect(produtctImageCount1).toBe(21)
  })

  it('Should set deleted one category and its products', async () => {
    await service.syncProducts()
    expect(spyFetch).toHaveBeenCalledTimes(1)
    const categoriesCount = await orm.em.count(Category, { isDeleted: false })
    const categoryProductCount1 = await orm.em.count(Product, { category: 1, isDeleted: false })
    const categoryProductCount2 = await orm.em.count(Product, { category: 2, isDeleted: false })
    const categoryProductCount3 = await orm.em.count(Product, { category: 3, isDeleted: false })
    const categoryImageCount1 = await orm.em.count(CategoryImage)
    const produtctImageCount1 = await orm.em.count(ProductImage)
    expect(categoriesCount).toBe(2)
    expect(categoryProductCount1).toBe(0)
    expect(categoryProductCount2).toBe(18)
    expect(categoryProductCount3).toBe(1)
    expect(categoryImageCount1).toBe(0)
    expect(produtctImageCount1).toBe(12)
  })

  afterAll(async () => {
    await orm.schema.clearDatabase()
    await orm.close()
    await app.close()
  })
})
