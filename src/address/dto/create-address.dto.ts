import { IsNotEmpty, MaxLength } from 'class-validator'

export class CreateAddressDto {
  @IsNotEmpty()
  @MaxLength(80)
  readonly city!: string

  @IsNotEmpty()
  @MaxLength(1000)
  readonly address!: string
}