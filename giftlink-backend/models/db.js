// db.js
require('dotenv').config();
const { MongoClient } = require('mongodb');

const url = process.env.MONGO_URL;
const dbName = 'giftdb';
let clientInstance = null;
let dbInstance = null;

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    if (!url) {
        throw new Error('MONGO_URL is not defined in the environment');
    }

    if (!clientInstance) {
        clientInstance = new MongoClient(url);
        await clientInstance.connect();
    }

    dbInstance = clientInstance.db(dbName);
    return dbInstance;
}

module.exports = connectToDatabase;
