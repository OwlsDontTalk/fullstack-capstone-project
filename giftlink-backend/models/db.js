/*jshint esversion: 9 */
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const url = process.env.MONGO_URL;

let clientInstance = null;
let dbInstance = null;
const dbName = 'giftdb';

async function connectToDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    if (!url) {
        throw new Error('MONGO_URL is not defined in the environment');
    }

    if (!clientInstance) {
        clientInstance = new MongoClient(url);
    }

    if (!clientInstance.topology || clientInstance.topology.isDestroyed()) {
        await clientInstance.connect();
    }

    dbInstance = clientInstance.db(dbName);
    return dbInstance;
}

module.exports = connectToDatabase;
