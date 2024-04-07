import { Body, Controller, Delete, HttpStatus, Param, Post, Get, UsePipes ,ParseIntPipe } from '@nestjs/common'
import { ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ValidationPipe } from '../shared/pipes/validation.pipe'
import { AddressService } from './address.service'
import { User } from '../user/user.decorator'
import { CreateAddressDto } from './dto'
import { Roles } from '../user/role/roles.decorator'

@Roles('user')
@Controller('addresses')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @ApiOperation({ summary: 'Create address for current user.' })
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
  @Delete(':addressId')
  async deleteAddress(@User('id') userId: number, @Param('addressId', ParseIntPipe) addressId: number) {
    return this.addressService.delete(userId, addressId)
  }
}
