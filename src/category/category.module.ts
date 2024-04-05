import { Module } from '@nestjs/common'
import { CategoryController } from './category.controller'
import { CategoryService } from './category.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Category } from './category.entity'
import { ProductModule } from './product/product.module'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService],
  imports: [MikroOrmModule.forFeature({ entities: [Category] }), ProductModule]
})
export class CategoryModule {}
