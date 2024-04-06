declare enum OrderPaymentType {
  Cash = 'cash',
  Online = 'online'
}

declare enum OrderStatus {
  New = 'new',
  Payed = 'payed',
  Canceled = 'canceled',
  Confirmed = 'confirmed'
}

interface FindAllByUserProps {
  userId: number
  page?: number
  pageSize?: number
}

interface AddProductProps {
  orderId: number
  productId: number
  amount?: number
}