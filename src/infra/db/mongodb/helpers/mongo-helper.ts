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

  getConnection (name: string): Collection {
    return this.client.db().collection(name)
  },

  map (collectionById: any): any {
    const { _id, ...collectionWithoutId } = collectionById

    const collection = Object.assign({}, collectionWithoutId, { id: _id.toHexString() }) as IAccountModel

    return collection
  }

}
