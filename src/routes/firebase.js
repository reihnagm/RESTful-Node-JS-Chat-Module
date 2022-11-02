const express = require("express")
const Route = express.Router()
const firebase = require("../controllers/firebase")

Route
	.post("/", firebase.initFcm)

module.exports = Route
