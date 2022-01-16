import { ObjectID } from 'bson'
import { IAddAccountRepository } from '../../../../data/protocols/db/IAddAccountRepositoyProtocol'
import { IloadAccountByEmailRepository } from '../../../../data/protocols/db/IloadAccountByEmailRepository'
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/IUpdateAccessTokenRepository'
import { IAccountModel } from '../../../../domain/entities/IAccountModel'
import { IAddAccountModel } from '../../../../domain/usecases/protocols/IAddAccount'
import { MongoHelper } from '../helpers/mongo-helper'

export class AccountMongoRepository implements IAddAccountRepository, IloadAccountByEmailRepository, IUpdateAccessTokenRepository {
  async add (accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const result = await accountCollection.insertOne(accountData)

    const accountCollectionById = await accountCollection.findOne({ _id: result.insertedId })

    const account = MongoHelper.map(accountCollectionById)

    return account
  }

  async loadByEmail (email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    const accountCollectionByEmail = await accountCollection.findOne({ email })

    if (!accountCollectionByEmail) {
      return null
    }

    const account = MongoHelper.map(accountCollectionByEmail)

    return account
  }

  async updateToken (acessToken: string, id: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts')

    await accountCollection.updateOne({
      _id: new ObjectID(id)
    }, {
      $set: {
        acessToken: acessToken
      }
    })
  }
}
