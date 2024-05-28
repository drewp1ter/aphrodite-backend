import { fetchAbsolute } from '../shared/helpers'
import { config } from '../config'
import { CreatePaymentRequestDto, PaymentProps, CreatePaymentResponseDto } from './yookassa.interface'
import { HttpStatus } from '@nestjs/common'

const baseUrl = 'https://api.yookassa.ru/v3'
const fetchYoomoney = fetchAbsolute(baseUrl)

export async function payment({ amount, idempotenceKey, description, metadata }: PaymentProps): Promise<CreatePaymentResponseDto> {
  const headers = new Headers()
  headers.set('Content-Type', 'application/json')
  headers.set('Authorization', `Basic ${Buffer.from(`${config.yookassa.shopId}:${config.yookassa.secretKey}`).toString('base64')}`)
  headers.set('Idempotence-Key', idempotenceKey)

  const reqestBody: CreatePaymentRequestDto = {
    amount: { value: amount, currency: 'RUB' },
    capture: true,
    confirmation: {
      type: 'redirect',
      return_url: config.thankYouPagePaymentOnline,
    },
    description,
    metadata
  }

  const res = await fetchYoomoney('/payments', {
    method: 'POST',
    headers,
    body: JSON.stringify(reqestBody)
  })

  const responseBody = await res.json() as any
  
  if (res.status >= HttpStatus.INTERNAL_SERVER_ERROR) {
    throw new Error(`[${res.status}]: Server error`)
  }  

  if (res.status >= HttpStatus.BAD_REQUEST) {
    throw new Error(`[${res.status}]: ${responseBody.description}`)
  }

  return responseBody
}
