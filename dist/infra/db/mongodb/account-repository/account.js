"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountMongoRepository = void 0;
const bson_1 = require("bson");
const mongo_helper_1 = require("../helpers/mongo-helper");
class AccountMongoRepository {
    async add(accountData) {
        const accountCollection = await mongo_helper_1.MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        const accountCollectionById = await accountCollection.findOne({ _id: result.insertedId });
        const account = mongo_helper_1.MongoHelper.map(accountCollectionById);
        return account;
    }
    async loadByEmail(email) {
        const accountCollection = await mongo_helper_1.MongoHelper.getCollection('accounts');
        const accountCollectionByEmail = await accountCollection.findOne({ email });
        if (!accountCollectionByEmail) {
            return null;
        }
        const account = mongo_helper_1.MongoHelper.map(accountCollectionByEmail);
        return account;
    }
    async updateToken({ acessToken, id }) {
        const accountCollection = await mongo_helper_1.MongoHelper.getCollection('accounts');
        await accountCollection.updateOne({
            _id: new bson_1.ObjectID(id)
        }, {
            $set: {
                acessToken: acessToken
            }
        });
    }
}
exports.AccountMongoRepository = AccountMongoRepository;
//# sourceMappingURL=account.js.map