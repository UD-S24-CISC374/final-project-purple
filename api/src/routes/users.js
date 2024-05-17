const router = require("express").Router();
const connDb = require("../db/dbConnect");

let db;

connDb().then((_db) => {
    db = _db;
});

router.get("/", (req, res) => {
    res.send("hi");
});

module.exports = router;
