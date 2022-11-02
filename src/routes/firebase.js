const express = require("express")
const Route = express.Router()
const firebase = require("../controllers/firebase")

Route
	.post("/", firebase.initFcm)
	.get("/all-user-fcm/:user_id", firebase.allUserFcm)

module.exports = Route
