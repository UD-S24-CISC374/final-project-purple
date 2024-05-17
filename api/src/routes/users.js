// All routes pertaining to handling users collection data
const router = require("express").Router();
const { ObjectId } = require("mongodb");
const connDb = require("../db/dbConnect");
const bcrypt = require("bcrypt");

let db;

connDb().then((_db) => {
    db = _db;
});

// create a user or login if exists
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
                : res.status(400).send("Wrong login or username taken");
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
        res.status(500).send("FAILED TO LOGIN");
    }
});

// update a user's profit
router.put("/:id/profit", async (req, res) => {
    const collection = await db.collection("users");
    const { id } = req.params;
    const { profit } = req.body;

    const objId = new ObjectId(id);

    if (profit === null) res.status(400).send("Missing profit");

    try {
        const user = await collection.findOneAndUpdate(
            { _id: objId },
            { $set: { best_profit: parseFloat(profit) || 0 } },
            { new: true }
        );

        res.send({
            id: user._id,
            username: user.username,
            best_profit: profit,
        }).status(200);
    } catch {
        res.status(500).send("FAILED TO UPDATE PROFIT");
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
        res.status(500).send("FAILED TO LOAD");
    }
});

module.exports = router;
