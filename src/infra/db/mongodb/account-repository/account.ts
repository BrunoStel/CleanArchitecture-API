import { IAddAccountRepository } from '../../../../data/protocols/IAddAccountRepositoyProtocol'
import { IAccountModel } from '../../../../domain/entities/IAccountModel'
import { IAddAccountModel } from '../../../../domain/usecases/protocols/IAddAccount'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountCollectionById = await accountCollection.findOne({ _id: result.insertedId })

    const account = MongoHelper.map(accountCollectionById)

    return account
  }
}
