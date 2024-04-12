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

  async findAll() {
    return this.categoryRepository.findAll()
  }
}
