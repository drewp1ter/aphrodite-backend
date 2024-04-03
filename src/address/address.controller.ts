import { Body, Controller, Delete, HttpStatus, Param, Post, Get, UsePipes } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { AddressService } from './address.service'
import { User } from '../user/user.decorator'
import { CreateAddressDto } from './dto'

@ApiBearerAuth()
@ApiTags('addresses')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: 'Create address' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The address has been successfully created.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @UsePipes(new ValidationPipe())
  @Post()
  async create(@User('id') userId: number, @Body('address') addressData: CreateAddressDto) {
    return this.addressService.create(userId, addressData)
  }

  @ApiOperation({ summary: 'Get all user addresses' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all user addresses' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @Get()
  async findAll(@User('id') userId: number) {
    return this.addressService.findAll(userId)
  }

  @ApiOperation({ summary: 'DeleteAddress' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The address has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
  @Delete(':id')
  async deleteAddress(@User('id') userId: number, @Param() params) {
    const { id } = params
    return this.addressService.delete(userId, id)
  }
}
