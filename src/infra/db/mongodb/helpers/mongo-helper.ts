import { Collection, MongoClient } from 'mongodb'
import { IAccountModel } from '../../../../domain/entities/IAccountModel'

export const MongoHelper = {
  client: null as MongoClient,

  async connect (uri: string): Promise<void> {
    this.client = await MongoClient.connect(uri)
  },

  async disconnect  (): Promise<void> {
    await this.client.close()
  },

  async getCollection (name: string): Promise<Collection> {
    const collection = await this.client.db().collection(name)
    return collection
  },

  map (collectionById: any): any {
    const { _id, ...collectionWithoutId } = collectionById

    const collection = Object.assign({}, collectionWithoutId, { id: _id.toHexString() }) as IAccountModel

    return collection
  }
}
