const express = require("express")
const Route = express.Router()
const Media = require("../controllers/media")

Route
	.post("/", Media.postMedia)

module.exports = Route
