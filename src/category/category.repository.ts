import { EntityRepository } from '@mikro-orm/mysql'
import { Category } from './category.entity'

export class CategoryRepository extends EntityRepository<Category> {}
