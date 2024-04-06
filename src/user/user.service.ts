import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { validate } from 'class-validator'
import crypto from 'crypto'
import { JwtService } from '@nestjs/jwt'
import { EntityManager, wrap } from '@mikro-orm/core'
import { CreateUserDto, LoginUserDto, UpdateUserDto } from './dto'
import { User } from './user.entity'
import { Role } from './role/role.entity'
import { Role as RoleEnum } from './role/role.enum'
import { IUserData } from './user.interface'
import { UserRepository } from './user.repository'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly em: EntityManager, private jwtService: JwtService) {}

  async signIn(loginUserDto: LoginUserDto): Promise<IUserData>  {
    const foundUser = await this.userRepository.findOne({
      email: loginUserDto.email,
      password: crypto.createHmac('sha256', loginUserDto.password).digest('hex')
    })

    if (!foundUser) {
      const errors = { User: ' not found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildUserRO(foundUser)
  }

  async signUp(createUserDto: CreateUserDto): Promise<IUserData> {
    const user = new User(createUserDto)
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

  async findById(id: number): Promise<IUserData> {
    const user = await this.userRepository.findOne(id)

    if (!user) {
      const errors = { User: ' not found' }
      throw new HttpException({ errors }, 401)
    }

    return this.buildUserRO(user)
  }

  async buildUserRO(user: User): Promise<IUserData> {
    const jwtPayload = { id: user.id, roles: user.roles.map((role) => role.role) }
    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      token: await this.jwtService.signAsync(jwtPayload),
      name: user.name
    }
  }
}
