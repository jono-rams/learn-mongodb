const { MongoClient } = require("mongodb");
require('dotenv').config();

// get environment variables
const db_username = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;

let dbConnection;
let uri = `mongodb+srv://${db_username}:${db_password}@cluster0.ugkk0.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

module.exports = {
  connectToDb: (cb) => {
    MongoClient.connect(uri)
      .then((client) => {
        dbConnection = client.db("bookstore");
        return cb();
      })
      .catch((err) => {
        console.error(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
