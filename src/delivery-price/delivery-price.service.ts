import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@mikro-orm/nestjs'
import { DeliveryPriceRepository } from './delivery-price.repository'
import { DeliveryPrice, DeliveryPriceDto } from './delivery-price.entity'
import { LoggerService } from '../shared/services/logger.service'
import { InputDeliveryPriceDto } from './dto/input-delivery-price.dto'

@Injectable()
export class DeliveryPriceService {
  logger = new LoggerService(DeliveryPriceService.name)

  constructor(
    @InjectRepository(DeliveryPrice)
    private readonly deliveryPriceRepository: DeliveryPriceRepository
  ) {}

  async create(dto: InputDeliveryPriceDto[]): Promise<number[]> {
    return this.deliveryPriceRepository.insertMany(dto)
  }

  async findOneById(deliveryPriceId: number): Promise<DeliveryPrice> {
    return this.deliveryPriceRepository.findOneOrFail({ id: deliveryPriceId })
  }

  async findOneByName(name: string): Promise<DeliveryPrice> {
    return this.deliveryPriceRepository.findOneOrFail({ name })
  }

  async findAll(): Promise<DeliveryPriceDto[]> {
    const deliveryPrices = await this.deliveryPriceRepository.findAll()
    return deliveryPrices.map((deliveryPrice) => deliveryPrice.toJSON())
  }

  async delete(deliveryPriceId: number): Promise<boolean> {
    const deletedRows = await this.deliveryPriceRepository.nativeDelete({ id: deliveryPriceId })
    return !!deletedRows
  }

  async update(deliveryPriceId: number, dto: InputDeliveryPriceDto): Promise<boolean> {
    const updatedRows = await this.deliveryPriceRepository.nativeUpdate({ id: deliveryPriceId }, dto)
    return !!updatedRows
  }
}
