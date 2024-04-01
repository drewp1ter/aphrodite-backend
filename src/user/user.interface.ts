export interface IUserData {
  id: number
  email: string
  phone?: string
  token: string
  username: string
}

export interface IUserRO {
  user: IUserData
}
