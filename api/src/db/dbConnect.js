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
        conn = await client.connect();
        conn = await client.db();
        console.log(
            "Pinged your deployment. You successfully connected to MongoDB!"
        );
        return conn;
    } catch (e) {
        console.error(e);
    }
}

module.exports = connDb;
