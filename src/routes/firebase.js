const express = require("express")
const Route = express.Router()
const firebase = require("../controllers/firebase")

Route
	.post("/", firebase.initFcm)
	.get("/get-user-fcm/:user_id", firebase.getUserFcm)
	.get("/all-user-except-currentuser-fcm/:user_id", firebase.allUserExceptCurrentUserFcm)

module.exports = Route
