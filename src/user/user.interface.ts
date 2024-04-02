export interface IUserData {
  id: number
  email: string
  phone?: string
  token: string
  name: string
}

export interface IUserRO {
  user: IUserData
}
