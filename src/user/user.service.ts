import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { validate } from 'class-validator'
import crypto from 'crypto'
import jwt from 'jsonwebtoken'
import { EntityManager, wrap } from '@mikro-orm/core'
import { SECRET } from '../config'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { User } from './user.entity'
import { IUserData } from './user.interface'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly em: EntityManager) {}

  async findOne(loginUserDto: LoginUserDto): Promise<User | null> {
    const findOneOptions = {
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex')
    }

    return this.userRepository.findOne(findOneOptions)
  }

  async create(dto: CreateUserDto): Promise<IUserData> {
    const { name, email, password, phone } = dto
    const exists = await this.userRepository.findOne({ email })

    if (exists) {
      throw new HttpException(
        {
          message: 'Input data validation failed',
          errors: { name: 'Email must be unique.' }
        },
        HttpStatus.BAD_REQUEST
      )
    }

    const user = new User({ name, password, phone, email })
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

  generateJWT(user) {
    const today = new Date()
    const exp = new Date(today)
    exp.setDate(today.getDate() + 60)

    return jwt.sign(
      {
        exp: exp.getTime() / 1000,
        id: user.id
      },
      SECRET
    )
  }

  private buildUserRO(user: User): IUserData {
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      token: this.generateJWT(user),
      name: user.name
    }
  }
}
