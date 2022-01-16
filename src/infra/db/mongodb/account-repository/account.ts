import { IAddAccountRepository } from '../../../../data/protocols/db/IAddAccountRepositoyProtocol'
import { IloadAccountByEmailRepository } from '../../../../data/protocols/db/IloadAccountByEmailRepository'
import { IAccountModel } from '../../../../domain/entities/IAccountModel'
import { IAddAccountModel } from '../../../../domain/usecases/protocols/IAddAccount'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository, IloadAccountByEmailRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountCollectionById = await accountCollection.findOne({ _id: result.insertedId })

    const account = MongoHelper.map(accountCollectionById)

    return account
  }

  async loadByEmail (email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const accountCollectionByEmail = await accountCollection.findOne({ email: email })

    const account = MongoHelper.map(accountCollectionByEmail)

    return account
  }
}
