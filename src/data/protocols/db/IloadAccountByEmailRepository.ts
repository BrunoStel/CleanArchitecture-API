import { IAccountModel } from '../../usecases/add-account/db-add-account-Protocols'

export interface IloadAccountByEmailRepository {
  load: (email: string) => Promise<IAccountModel>
}
