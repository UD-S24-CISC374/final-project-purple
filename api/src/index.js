require("./loadEnv.js");
const express = require("express");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

const users = require("./routes/users.js");

app.use("/users", users);

app.listen(port, () => {
    console.log(`listening on ${port}`);
});
