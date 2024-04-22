import { Module } from '@nestjs/common'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Category } from '../category/category.entity'
import { IikoService } from './iiko.service'
import { IikoController } from './iiko.controller'
import { Product } from '../product/product.entity'

@Module({
  controllers: [IikoController],
  providers: [IikoService],
  imports: [MikroOrmModule.forFeature({ entities: [Category, Product] })]
})
export class IikoModule {}
