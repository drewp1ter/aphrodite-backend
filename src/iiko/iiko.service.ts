import { Injectable, UnauthorizedException } from '@nestjs/common'
import { EntityManager } from '@mikro-orm/core'
import { Category } from '../category/category.entity'
import { Product } from '../product/product.entity'
import { IGroup, INomenclature } from './iiko.interface'
import * as api from './iiko.api'
import { CategoryImage } from '../category-image/category-image.entity'
import { ProductImage } from '../product-image/product-image.entity'
import { config } from '../config'

@Injectable()
export class IikoService {
  private iikoToken!: string

  constructor(private readonly em: EntityManager) {}

  async updateProducts() {
    let nomenclature: INomenclature | null = null
    this.iikoToken ??= await api.accessToken()

    for (let i = 3; i--; ) {
      try {
        nomenclature = await api.nomenclature(this.iikoToken)
        break
      } catch (e) {
        if (i === 1) throw e
        if (e instanceof UnauthorizedException) {
          this.iikoToken = await api.accessToken()
        }
      }
    }

    return this.em.transactional(async (em) => {
      if (!nomenclature) return

      const actualCategories = nomenclature.groups.filter(this.isGroupValid).map((category) => {
        return new Category({
          name: category.name.slice(config.iiko.categoryMarker.length),
          description: category.description ?? '',
          order: category.order,
          isDeleted: category.isDeleted,
          iikoId: category.id
        })
      })

      const updatedCategories = await em.upsertMany(Category, actualCategories)

      const actualProducts = nomenclature.products.reduce<Product[]>((result, product) => {
        const category = updatedCategories.find((category) => category.iikoId === product.parentGroup)
        category &&
          result.push(
            new Product({
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
              iikoId: product.id,
              category
            })
          )
        return result
      }, [])

      const updatedProducts = await em.upsertMany(Product, actualProducts)

      const updatedCategoriesIds = updatedCategories.map((category) => category.iikoId!)
      const updatedProductsIds = updatedProducts.map((product) => product.iikoId!)
      await em.nativeUpdate(Category, { iikoId: { $nin: updatedCategoriesIds } }, { isDeleted: true })
      await em.nativeUpdate(Product, { iikoId: { $nin: updatedProductsIds } }, { isDeleted: true })

      const categoryImages = nomenclature.groups.filter(this.isGroupValid).reduce<CategoryImage[]>((result, group) => {
        const category = updatedCategories.find((category) => category.iikoId === group.id)
        category &&
          group.imageLinks.filter(this.isImageLinkCorrect).forEach((imageLink) => {
            result.push(new CategoryImage({ category, url: imageLink, type: 'from_iiko' }))
          })
        return result
      }, [])

      const productImages = nomenclature.products.reduce<ProductImage[]>((result, iikoProduct) => {
        const product = updatedProducts.find((product) => product.iikoId === iikoProduct.id)
        product &&
          iikoProduct.imageLinks.filter(this.isImageLinkCorrect).forEach((imageLink) => {
            result.push(new ProductImage({ product, url: imageLink, type: 'from_iiko' }))
          })
        return result
      }, [])

      const updatedCategoryImages = await em.upsertMany(CategoryImage, categoryImages)
      const updatedProductImages = await em.upsertMany(ProductImage, productImages)
      const updatedCategoryImagesIds = updatedCategoryImages.map((updatedCategoryImage) => updatedCategoryImage.id)
      const updatedProductImagesIds = updatedProductImages.map((updatedProductImage) => updatedProductImage.id)
      await em.nativeDelete(CategoryImage, { id: { $nin: updatedCategoryImagesIds }, type: 'from_iiko' })
      await em.nativeDelete(ProductImage, { id: { $nin: updatedProductImagesIds }, type: 'from_iiko' })

      return {
        totalCategories: updatedCategories.length,
        totalProducts: updatedProducts.length
      }
    })
  }

  isGroupValid(group: IGroup) {
    return group.name.startsWith(config.iiko.categoryMarker)
  }

  isImageLinkCorrect(imageLink: string): boolean {
    return 'IMAGE_UPLOAD_ERROR' !== imageLink
  }
}
