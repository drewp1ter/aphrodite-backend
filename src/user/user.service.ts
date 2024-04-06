import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { validate } from 'class-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { JwtService } from '@nestjs/jwt'
import { EntityManager, wrap } from '@mikro-orm/core'
import { SECRET } from '../config'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { User } from './user.entity'
import { Role } from './role/role.entity'
import { Role as RoleEnum } from './role/role.enum'
import { IUserData } from './user.interface'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly em: EntityManager, private jwtService: JwtService) {}

  async findOne(loginUserDto: LoginUserDto): Promise<User | null> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex')
    }

    return this.userRepository.findOne(findOneOptions)
  }

  async create(dto: CreateUserDto): Promise<IUserData> {
    const { name, email, password, phone } = dto

    const user = new User({ name, password, phone, email })
    const roleUser = await this.em.findOneOrFail(Role, { role: RoleEnum.User })
    user.roles.add(roleUser)

    const errors = await validate(user)
    if (errors.length > 0) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { name: 'Userinput is not valid.' }
        },
        HttpStatus.BAD_REQUEST
      )
    } else {
      await this.em.persistAndFlush(user)
      return this.buildUserRO(user)
    }
  }

  async update(id: number, dto: UpdateUserDto) {
    const user = await this.userRepository.findOneOrFail(id)
    wrap(user).assign(dto)
    await this.em.flush()

    return this.buildUserRO(user)
  }

  async delete(email: string) {
    return this.userRepository.nativeDelete({ email })
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
    const jwtPayload = { id: user.id, roles: user.roles.map(role => role.role) }
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      token: await this.jwtService.signAsync(jwtPayload),
      name: user.name,
      roles: user.roles.getItems().map(item => item.role)
    }
  }
}
