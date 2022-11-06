const express = require("express")
const auth = require("./routes/auth")
const chat = require("./routes/chat")
const firebase = require("./routes/firebase")
const product = require("./routes/product")
const media = require("./routes/media")
const Route = express.Router()

Route
	.use("/api/v1/accounts", auth)
    .use("/api/v1/chats", chat)
    .use("/api/v1/firebases", firebase)
    .use("/api/v1/products", product)
	.use("/api/v1/medias", media)

module.exports = Route
