import { MongoHelper as sut } from './mongo-helper'

describe('Mongo Helper', () => {
  beforeAll(async () => {
    await sut.connect(process.env.MONGO_URL)
  })

  afterAll(async () => {
    await sut.disconnect()
  })

  it('Should reconnect if mongodb is down', async () => {
    let accountCollection = sut.getConnection('accounts')

    expect(accountCollection).toBeTruthy()

    await sut.disconnect()

    accountCollection = sut.getConnection('accounts')
    expect(accountCollection).toBeTruthy()
  })
})
