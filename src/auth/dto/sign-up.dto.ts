import { IsNotEmpty, Length, MaxLength, IsPhoneNumber, IsEmail, IsString, ValidateIf } from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  readonly name!: string

  @ValidateIf((_object, value) => value !== '')
  @IsEmail(undefined, { message: 'email должен быть электронной почтой' })
  readonly email!: string

  @IsPhoneNumber('RU', { message: 'телефон должен быть действительным номером телефона' })
  readonly phone!: string

  @IsString()
  @Length(8, 64, { message: 'пароль должен быть длиннее или равен 8 символам' })
  readonly password!: string
}
