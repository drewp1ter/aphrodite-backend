import { Controller, HttpStatus, Get, Query, Param, ParseIntPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ProductService } from './product.service'

@ApiBearerAuth()
@ApiTags('products')
@Controller(':categoryId')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get products by categoryId' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('products')
  async findGroupAll(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.findByCategoryId(categoryId)
  }

  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async findAll(@Query('query') query: string) {
    return this.productService.find(query)
  }
}
