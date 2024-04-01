import { IsNotEmpty, Length, MaxLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(80)
  readonly username!: string

  @IsNotEmpty()
  readonly email!: string

  readonly phone?: string

  @IsNotEmpty()
  @Length(8, 64)
  readonly password!: string
}
