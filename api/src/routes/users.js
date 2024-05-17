// All routes pertaining to handling users collection data
const router = require("express").Router();
const connDb = require("../db/dbConnect");
const bcrypt = require("bcrypt");

let db;

connDb().then((_db) => {
    db = _db;
});

router.get("/", async (req, res) => {
    const collection = await db.collection("users");
    const results = await collection.find({}).toArray();

    res.send(results).status(200);
});

router.post("/", async (req, res) => {
    const collection = await db.collection("users");
    const { username, password } = req.body;

    try {
        const existing = await collection.findOne({ username });
        if (existing) {
            const verified = await bcrypt.compare(password, existing.password);
            verified
                ? res
                      .send({
                          id: existing._id,
                          username,
                          best_profit: existing.best_profit,
                      })
                      .status(200)
                : res.send("Wrong login or username taken").status(400);
        } else {
            const salt = await bcrypt.genSalt();
            const hashedPass = await bcrypt.hash(password, salt);

            const newUser = { username, password: hashedPass, best_profit: 0 };
            const insertion = await collection.insertOne(newUser);
            res.send({
                id: insertion.insertedId,
                username: newUser.username,
                best_profit: newUser.best_profit,
            }).status(200);
        }
    } catch {
        res.send("FAILED TO LOGIN").status(500);
    }
});

// get top 10 players with highest profit
router.get("/leaderboard", async (req, res) => {
    try {
        const collection = await db.collection("users");
        const results = await collection
            .aggregate([
                { $project: { username: 1, best_profit: 1 } },
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
