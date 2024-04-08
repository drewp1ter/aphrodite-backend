import { IUserData } from '../user/user.interface'

export interface ISignInData extends IUserData {
  token: string
}