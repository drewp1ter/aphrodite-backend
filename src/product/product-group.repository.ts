import { EntityRepository } from '@mikro-orm/mysql'
import { ProductGroup } from './product-group.entity'

export class ProductGroupRepository extends EntityRepository<ProductGroup> {}
