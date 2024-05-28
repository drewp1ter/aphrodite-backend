import { ArgumentMetadata, BadRequestException, HttpException, HttpStatus, Injectable, PipeTransform } from '@nestjs/common'
import { plainToClass } from 'class-transformer'
import { ValidationError, validate } from 'class-validator'

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    if (!value) {
      throw new BadRequestException('No data submitted')
    }

    if (Object.prototype.toString.apply(value) === '[object Array]') {
      throw new BadRequestException('Expecting an object but received an array')
    }

    const { metatype } = metadata
    if (!metatype || !this.toValidate(metatype)) {
      return value
    }

    const object = plainToClass(metatype, value)
    const errors = await validate(object)
    if (errors.length > 0) {
      throw new HttpException({ message: 'Ошибка валидации, пожалуйста проверьте введенные вами данные', errors: this.buildError(errors) }, HttpStatus.BAD_REQUEST)
    }
    return value
  }

  private buildError(errors: ValidationError[]) {
    const result = {}
    errors.forEach((el) => {
      const prop = el.property
      if (el.constraints) {
        Object.entries(el.constraints).forEach((constraint) => {
          result[`${prop}.${constraint[0]}`] = `${constraint[1]}`
        })
      }

      if (el.children) {
        Object.assign(result, this.buildError(el.children))
      }
    })
    return result
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object]
    return !types.find((type) => metatype === type)
  }
}
