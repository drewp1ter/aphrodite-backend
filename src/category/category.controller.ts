import { Controller, HttpStatus, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { CategoryService } from './category.service'
import { Roles } from '../user/role/roles.decorator'

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
}
