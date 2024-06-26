import { Controller, HttpStatus, Get, Query, Param, ParseIntPipe } from '@nestjs/common'
import { ApiBearerAuth, ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ProductService } from './product.service'

@ApiBearerAuth()
@ApiTags('products')
@Controller()
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiOperation({ summary: 'Get products by categoryId' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('categories/:categoryId/products')
  async findGroupAll(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.findByCategoryId(categoryId)
  }

  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get('products')
  async findAll(
    @Query('query') query: string,
    @Query('page', new ParseIntPipe({ optional: true })) page: number,
    @Query('pageSize', new ParseIntPipe({ optional: true })) pageSize: number
  ) {
    return this.productService.find({query, page, pageSize})
  }
}
