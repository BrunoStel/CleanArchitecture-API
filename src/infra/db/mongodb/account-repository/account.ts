import { IAddAccountRepository } from '../../../../data/usecases/protocols/IAddAccountRepositoyProtocol'
import { IAccountModel } from '../../../../domain/models/IAccountModel'
import { IAddAccountModel } from '../../../../domain/usecases/protocols/IAddAccount'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = MongoHelper.getConnection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountById = await accountCollection.findOne({ _id: result.insertedId })

    const { _id, ...accountWithoutId } = accountById

    const account = Object.assign({}, accountWithoutId, { id: _id.toHexString() }) as IAccountModel

    return account
  }
}
