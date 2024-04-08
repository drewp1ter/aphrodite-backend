import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import crypto from 'crypto'
import { EntityManager, wrap } from '@mikro-orm/core'
import { CreateUserDto, UpdateUserDto } from './dto'
import { User } from './user.entity'
import { Role } from '../auth/role/role.entity'
import { Role as RoleEnum } from '../auth/role/role.enum'
import { IUserData } from './user.interface'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly em: EntityManager) {}

  async findOne(email: string, password: string): Promise<IUserData>  {
    const foundUser = await this.userRepository.findOne({
      email,
      password: crypto.createHmac('sha256', password).digest('hex')
    })

    if (!foundUser) {
      const errors = { User: ' not found' }
      throw new HttpException({ errors }, HttpStatus.UNAUTHORIZED)
    }

    return this.buildUserRO(foundUser)
  }

  async create(createUserDto: CreateUserDto): Promise<IUserData> {
    const user = new User(createUserDto)
    const roleUser = await this.em.findOneOrFail(Role, { role: RoleEnum.User })
    user.roles.add(roleUser)
    await this.em.persistAndFlush(user)
    return this.buildUserRO(user)
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail(id)
    wrap(user).assign(dto)
    await this.em.flush()
    return this.buildUserRO(user)
  }

  async findById(id: number): Promise<IUserData> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      const errors = { User: ' not found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildUserRO(user)
  }

  async buildUserRO(user: User): Promise<IUserData> {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      roles: user.roles.map(role => role.role)
    }
  }
}
