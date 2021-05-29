const express = require("express");
const cors = require("cors");

const router = require("./router");
const app = express();

app.use(
    cors({
        origin: "http://localhost:3000",
        methods: ["GET", "PUT", "POST", "DELETE"],
    })
);
app.use(express.json());

app.use(router);

app.listen(5000, () => {
    console.log("Listening on port 5000");
});
