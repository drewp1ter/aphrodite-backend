import { EntityRepository } from '@mikro-orm/mysql'
import { Product } from './product.entity'

export interface FindAllbyCategoryId {
  categoryId: number
  limit?: number
  offset?: number
}
export class ProductRepository extends EntityRepository<Product> {
  async findAllbyCategoryId({ categoryId, limit = 40, offset = 0 }: FindAllbyCategoryId) {
    const [result] = await this.em.execute(
      `
      select 
        category.id, 
        category.name, 
        json_arrayagg(
          json_object(
            'id', product.id, 
            'name', product.name, 
            'price', product.price,
            'description', product.description, 
            'carbohydrates', product.carbohydrates, 
            'fats', product.fats,
            'proteins', product.proteins,
            'calories', product.calories,
            'weight', product.weight,
            'measureUnit', product.measure_unit,
            'flags', product.flags,
            'images', json_array(
              (select 
                group_concat(
                  json_object('id', id, 'url', url, 'type', type)
                ) 
                from product_image 
                where product_id = product.id
              )  
            )
          )
        ) as products 
      from 
        category 
      join 
        product on product.category_id = category.id 
      where 
        category.id = ?
      group by 
        category.id, category.name
      limit ?
      offset ?

    `,
      [categoryId, limit, offset]
    )

    result.products = result.products.map((product) => {
      product.images = JSON.parse(product.images)
      return product
    })

    return result
  }
}
