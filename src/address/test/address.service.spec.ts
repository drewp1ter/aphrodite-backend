import { Test, TestingModule } from '@nestjs/testing'
import { AddressService } from '../address.service'

describe('AddressService', () => {
  let service: AddressService

  const mockEntityManager = {
    persistAndFlush: jest.fn().mockImplementation(async () => {}),
    flush: jest.fn().mockImplementation(async () => {})
  }

  const mockAddressRepository = {
    nativeDelete: jest.fn().mockImplementation(() => 1),
    findAllUserAddresses: jest.fn().mockImplementation(() => ([
      {
        id: 1,
        city: 'City 17',
        address: 'black mesa',
        isDefault: false
      },
      {
        id: 2,
        city: 'Los Santos',
        address: 'Groove Street',
        isDefault: true
      }
    ]))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressService]
    }).compile()

    service = module.get<AddressService>(AddressService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
