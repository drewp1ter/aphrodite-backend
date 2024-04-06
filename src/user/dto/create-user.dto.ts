import { IsNotEmpty, Length, MaxLength, IsPhoneNumber, IsEmail, IsString } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  readonly name!: string
  
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone!: string

  @IsNotEmpty()
  @IsString()
  @Length(8, 64)
  readonly password!: string
}
