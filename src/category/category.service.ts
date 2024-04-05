import { Injectable } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/core'
import { InjectRepository } from '@mikro-orm/nestjs'
import { Category } from './category.entity'
import { CategoryRepository } from './category.repository'

@Injectable()
export class CategoryService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async findAll() {
    return this.categoryRepository.findAll()
  }
}
