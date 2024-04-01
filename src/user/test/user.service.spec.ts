import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from '../user.service'
import { UserRepository } from '../user.repository'
import { EntityManager } from '@mikro-orm/core'

describe('UsersService', () => {
  let service: UserService

  const mockEntityManager = {
    persistAndFlush: jest.fn().mockImplementation(async () => {})
  }
  const mockUserRepository = {
    findAll: jest.fn().mockImplementation(async () => []),
    findOne: jest.fn().mockImplementation(async (options) => {
      if (options.email === 'notfound@test.com') return null
      return {
        id: Date.now() || options.id,
        email: 'test@test.com' || options.email,
        password: 'test' || options.password,
        phone: '+79991234567',
        username: 'test'
      }
    }),
    count: jest.fn().mockImplementation(() => 0),
    nativeDelete: jest.fn().mockImplementation(() => 1),
    findOneOrFail: jest.fn().mockImplementation((options) => ({
      id: Date.now(),
      email: 'test@test.com' || options.email,
      phone: '+79991234567',
      username: 'test'
    }))
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager
        }
      ]
    }).compile()

    service = module.get<UserService>(UserService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('should return all users', async () => {
    expect(await service.findAll()).toStrictEqual([])
  })
  it('should return one user', async () => {
    const user = await service.findOne({
      email: 'test@test.com',
      password: 'test'
    })
    expect(user).toEqual({
      id: expect.any(Number),
      email: 'test@test.com',
      username: 'test',
      phone: '+79991234567'
    })
  })
  it('should delete user', async () => {
    expect(await service.delete('test@test.com')).toBe(1)
  })
  it('should create user', async () => {
    expect(
      await service.create({
        email: 'notfound@test.com',
        password: 'test',
        username: 'testtest',
      })
    ).toEqual({
      user: {
        email: 'notfound@test.com',
        token: expect.any(String),
        username: 'testtest'
      }
    })
  })
  it('should return user by id', async () => {
    expect(await service.findById(1)).toEqual({
      user: {
        email: 'test@test.com',
        phone: '+79991234567',
        token: expect.any(String),
        username: 'test'
      }
    })
  })
  it('should return user by email', async () => {
    expect(await service.findByEmail('test@test.com')).toEqual({
      user: {
        email: 'test@test.com',
        phone: '+79991234567',
        token: expect.any(String),
        username: 'test'
      }
    })
  })
})
