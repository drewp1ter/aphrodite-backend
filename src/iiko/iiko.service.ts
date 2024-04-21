import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { EntityManager } from '@mikro-orm/core'
import { Category } from '../category/category.entity'
import { CategoryRepository } from '../category/category.repository'
import { Product } from '../product/product.entity'
import { ProductRepository } from '../product/product.repository'
import { INomenclature } from './iiko.interface'
import * as api from './iiko.api'
import { CategoryImage } from '../category-image/category-image.entity'
import { ProductImage } from '../product-image/product-image.entity'

@Injectable()
export class IikoService {
  iikoToken!: string

  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Category)
    private readonly categoryRepository: CategoryRepository,
    @InjectRepository(Product)
    private readonly productRepository: ProductRepository
  ) {}

  async syncProducts() {
    this.iikoToken ??= await api.accessToken()
    let nomenclature: INomenclature | null = null
    for (let i = 3; i--; ) {
      try {
        nomenclature = await api.nomenclature(this.iikoToken)
        break
      } catch (e) {
        this.iikoToken = await api.accessToken()
      }
    }

    return this.em.transactional(async (em) => {
      if (!nomenclature) return

      const actualCategories = nomenclature.groups
        .filter((group) => group.name.startsWith('#'))
        .map((category) => {
          return new Category({
            name: category.name.slice(1),
            description: category.description ?? '',
            order: category.order,
            isDeleted: category.isDeleted,
            iikoId: category.id
          })
        })

      const updatedCategories = await this.categoryRepository.upsertMany(actualCategories, { ctx: em.getContext() })

      const actualProducts = nomenclature.products.reduce<Product[]>((result, product) => {
        const category = updatedCategories.find((category) => category.iikoId === product.parentGroup)
        category &&
          result.push(
            new Product({
              iikoId: product.id,
              name: product.name,
              price: product.sizePrices[0].price.currentPrice,
              description: product.description ?? '',
              fats: product.fatAmount,
              carbohydrates: product.carbohydratesAmount,
              proteins: product.proteinsAmount,
              calories: product.energyAmount,
              weight: product.weight,
              measureUnit: product.measureUnit,
              order: product.order,
              isDeleted: product.isDeleted,
              category
            })
          )
        return result
      }, [])

      const updatedProducts = await this.productRepository.upsertMany(actualProducts, { ctx: em.getContext() })

      const updatedCategoriesIds = updatedCategories.map((category) => category.iikoId!)
      const updatedProductsIds = updatedProducts.map((product) => product.iikoId!)
      await this.categoryRepository.nativeUpdate({ iikoId: { $nin: updatedCategoriesIds } }, { isDeleted: true }, { ctx: em.getContext() })
      await this.productRepository.nativeUpdate({ iikoId: { $nin: updatedProductsIds } }, { isDeleted: true }, { ctx: em.getContext() })

      const categoryImages = nomenclature.groups
        .filter((group) => group.name.startsWith('#'))
        .reduce<CategoryImage[]>((result, group) => {
          const category = updatedCategories.find((category) => category.iikoId === group.id)
          category &&
            group.imageLinks.forEach((imageLink) => {
              result.push(
                new CategoryImage({
                  category,
                  url: imageLink,
                  type: 'from_iiko'
                })
              )
            })
          return result
        }, [])

      const productImages = nomenclature.products.reduce<ProductImage[]>((result, iikoProduct) => {
        const product = updatedProducts.find((product) => product.iikoId === iikoProduct.id)
        product &&
          iikoProduct.imageLinks.forEach((imageLink) => {
            result.push(new ProductImage({ product, url: imageLink, type: 'from_iiko' }))
          })
        return result
      }, [])

      const updatedCategoryImages = await em.upsertMany(CategoryImage, categoryImages)
      const updatedProductImages = await em.upsertMany(ProductImage, productImages)
      const updatedCategoryImagesIds = updatedCategoryImages.map(updatedCategoryImage => updatedCategoryImage.id)
      const updatedProductImagesIds = updatedProductImages.map(updatedProductImage => updatedProductImage.id)
      await em.nativeDelete(CategoryImage, { id: { $nin: updatedCategoryImagesIds }, type: 'from_iiko' })
      await em.nativeDelete(ProductImage, { id: { $nin: updatedProductImagesIds }, type: 'from_iiko' })
    })
  }
}
