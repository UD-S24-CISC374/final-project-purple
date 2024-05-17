// All routes pertaining to handling user collection data
const router = require("express").Router();
const connDb = require("../db/dbConnect");

let db;

connDb().then((_db) => {
    db = _db;
});

router.get("/", async (req, res) => {
    let collection = await db.collection("users");
    let results = await collection.find({}).toArray();
    res.send(results);
});

module.exports = router;
