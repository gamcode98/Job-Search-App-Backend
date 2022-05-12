const express = require("express");
const { port } = require("./config");
const { connection } = require("./config/db");
const auth = require("./routes/auth.routes");
const offers = require("./routes/offer.routes");
const users = require("./routes/user.routes");

connection();

const app = express();

app.use(express.json());

users(app);
auth(app);
offers(app);

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
