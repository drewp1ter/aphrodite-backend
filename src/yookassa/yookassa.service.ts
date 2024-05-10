import { Injectable } from '@nestjs/common'
import { EventEmitter2 } from '@nestjs/event-emitter'
import * as api from './yookassa.api'
import { CreatePaymentResponseDto, PaymentProps, YookassaNotificationDto } from './yookassa.interface'

@Injectable()
export class YookassaService {
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async createPayment(props: PaymentProps): Promise<CreatePaymentResponseDto> {
    const paymentResponse = await api.payment(props)

    this.eventEmitter.emit('payment.created', paymentResponse)
    return paymentResponse
  }

  notification(dto: YookassaNotificationDto) {
    this.eventEmitter.emit(dto.event, dto.object)
  }
}
