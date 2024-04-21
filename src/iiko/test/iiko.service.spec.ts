import { Test } from '@nestjs/testing'
import { fetchMock } from './fetchMock'
import mikroConfig from '../../mikro-orm.config'
import { AppModule } from '../../app.module'
import { INestApplication } from '@nestjs/common'
import { MikroORM } from '@mikro-orm/core'
import { IikoService } from '../iiko.service'

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

  it('Fetch has been called', async () => {
    await service.syncProducts()
    expect(spyFetch).toHaveBeenCalledTimes(4)
  })
})
