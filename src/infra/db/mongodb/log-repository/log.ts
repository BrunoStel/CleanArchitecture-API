import { ILogErrorRepository } from '../../../../data/protocols/db/ILogErrorRepositoryProtocol'
import { MongoHelper } from '../helpers/mongo-helper'

export class LogMongoRepository implements ILogErrorRepository {
  async logError (stack: string): Promise<void> {
    const errorCollection = await MongoHelper.getCollection('errors')
    await errorCollection.insertOne({
      stack,
      date: new Date()
    })
  }
}
