import { Controller, HttpStatus, Get, Param, ParseIntPipe } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CategoryService } from './category.service'

@ApiTags('categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly productService: CategoryService) {}

  @ApiOperation({ summary: 'Get all product categories' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get()
  async findAll() {
    return this.productService.findAll()
  }

  @ApiOperation({ summary: 'Get category' })
  @ApiResponse({ status: HttpStatus.OK })
  @Get(':categoryId')
  async findOne(@Param('categoryId', ParseIntPipe) categoryId: number) {
    return this.productService.findOne(categoryId)
  }
}
