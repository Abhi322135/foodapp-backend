const { MongoClient } = require("mongodb");

const config = {
  url:"mongodb+srv://demoUser:njrQDJw4WzH3cz68@cluster0.rhnbwpl.mongodb.net/users",
  dbName: "demo"
};

async function createConnection() {
  const connection = await MongoClient.connect(config.url, {
    useNewUrlParser: true
  });
  const db = connection.db(config.dbName);
  return {
    connection,
    db
  };
}

module.exports = createConnection;
