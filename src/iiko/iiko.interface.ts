export interface IGroup {
  id: string
  imageLinks: string[]
  order: number
  name: string
  description: string | null
  tags: string[]
  additionalInfo: string | null
  isDeleted: boolean
}

export interface IPice {
  currentPrice: number
  isIncludedInMenu: boolean
  nextIncludedInMenu: boolean
}

export interface ISizePrice {
  sizeId: string | null
  price: IPice
}

export interface IProduct {
  id: string
  fatAmount: number
  proteinsAmount: number
  carbohydratesAmount: number
  energyAmount: number
  fatFullAmount: number
  proteinsFullAmount: number
  carbohydratesFullAmount: number
  energyFullAmount: number
  weight: number
  measureUnit: 'порц'
  sizePrices: ISizePrice[]
  imageLinks: string[]
  doNotPrintInCheque: boolean
  parentGroup: string
  order: number
  fullNameEnglish: string
  useBalanceForSell: boolean
  canSetOpenPrice: boolean
  paymentSubject: string
  code: string
  name: string
  description: string | null
  additionalInfo: string | null
  tags: string[] | null
  isDeleted: boolean
  seoDescription: string | null
  seoText: string | null
  seoKeywords: string | null
  seoTitle: string | null
}

export interface INomenclature {
  correlationId: string
  groups: IGroup[]
  products: IProduct[]
  revision: number
}

export interface UpdateProductsBody {
  token: string
}
