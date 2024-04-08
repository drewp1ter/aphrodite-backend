import { IsNotEmpty, Length, MaxLength, IsPhoneNumber, IsEmail, IsString } from 'class-validator'

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(80)
  readonly name!: string
  
  @IsEmail()
  readonly email!: string

  @IsPhoneNumber()
  readonly phone!: string

  @IsString()
  @Length(8, 64)
  readonly password!: string
}
