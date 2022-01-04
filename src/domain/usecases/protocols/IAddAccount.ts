import { IAccountModel } from '../models/AccountModel'

export interface IAddAccountModel {
  name: string
  email: string
  password: string
}

export interface IAddAccount {
  add: (account: IAddAccountModel) => IAccountModel
}
