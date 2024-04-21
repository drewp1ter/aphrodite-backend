import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Category } from '../category/category.entity'
import { IikoService } from './iiko.service'
import { Product } from '../product/product.entity'

@Module({
  controllers: [],
  providers: [IikoService],
  imports: [MikroOrmModule.forFeature({ entities: [Category, Product] })]
})
export class IikoModule {}
