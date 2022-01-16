import { IAccountModel } from '../../usecases/add-account/db-add-account-Protocols'

export interface IloadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<IAccountModel>
}
