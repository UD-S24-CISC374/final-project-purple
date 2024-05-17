// Most of this is from the connection code provided by mongodb.com
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.CONN_URI || "";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    },
});

let conn;

async function connDb() {
    try {
        await client.connect();
        conn = client.db("competitive"); // just one db from the cluster, maybe we'll have more ;)
        return conn;
    } catch (e) {
        console.error(e);
    }
}

module.exports = connDb;
