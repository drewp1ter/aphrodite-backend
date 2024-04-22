import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Category } from './category.entity'
import { CategoryRepository } from './category.repository'

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findOne(categoryId) {
    return this.categoryRepository.findOne(categoryId, { fields: ['id', 'name'] })
  }

  async findAll() {
    return this.categoryRepository.findAll({ where: { isDeleted: false }, orderBy: { order: 'ASC' }, populate: ['images'] })
  }
}
