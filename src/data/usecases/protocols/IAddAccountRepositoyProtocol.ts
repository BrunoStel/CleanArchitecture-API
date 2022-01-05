import { IAccountModel, IAddAccountModel } from '../add-account/db-add-account-Protocols'

export interface IAddAccountRepository {
  add: (accountData: IAddAccountModel) => Promise<IAccountModel>
}
