import { IAccountModel } from '../../entities/IAccountModel'

export interface IAddAccountModel {
  name: string
  email: string
  password: string
}

export interface IAddAccount {
  execute: (account: IAddAccountModel) => Promise<IAccountModel>
}
