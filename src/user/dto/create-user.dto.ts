import { IsNotEmpty, Length, MaxLength, IsPhoneNumber, IsEmail, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  @MaxLength(80)
  readonly name!: string
  
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string

  @IsNotEmpty()
  @IsPhoneNumber()
  readonly phone!: string

  @IsNotEmpty()
  @Length(8, 64)
  readonly password!: string
}
