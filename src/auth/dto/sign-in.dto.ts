import { IsNotEmpty } from 'class-validator'

export class SignInDto {
  @IsNotEmpty({ message: 'email не должен быть пустым.' })
  readonly email!: string

  @IsNotEmpty({ message: 'пароль не должен быть пустым.' })
  readonly password!: string
}
