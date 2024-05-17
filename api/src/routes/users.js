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

    res.send(results).status(200);
});

// get top 10 players with highest profit
router.get("/leaderboard", async (req, res) => {
    try {
        let collection = await db.collection("users");
        let results = await collection
            .aggregate([
                { $project: { name: 1, best_profit: 1 } },
                { $sort: { best_profit: -1 } },
                { $limit: 10 },
            ])
            .toArray();
        res.send(results).status(200);
    } catch {
        res.send("FAILED TO LOAD").status(500);
    }
});

module.exports = router;
