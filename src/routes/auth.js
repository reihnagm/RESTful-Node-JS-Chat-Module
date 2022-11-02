const express = require("express")
const Route = express.Router()
const auth = require("../controllers/auth")

Route
	.post("/", auth.login)
	

module.exports = Route
