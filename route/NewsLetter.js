const express = require("express");
const { subscribeToNewsLetter, unsubscribeFromNewsLetter } = require("../controllers/NewLetter");
const route = express.Router();

route.post("/subscribe", subscribeToNewsLetter);

route.delete("/unsubscribe", unsubscribeFromNewsLetter);

module.exports = route;
