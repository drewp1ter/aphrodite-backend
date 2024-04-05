import { Module } from '@nestjs/common'
import { ProductController } from './product.controller'
import { ProductService } from './product.service'
import { MikroOrmModule } from '@mikro-orm/nestjs'
import { Product } from './product.entity'

@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [MikroOrmModule.forFeature({ entities: [Product] })]
})
export class ProductModule {}
