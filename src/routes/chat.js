const express = require("express")
const Route = express.Router()
const chat = require("../controllers/chat")

Route
	.post("/init-conversation", chat.initConversation)
	.get("/check-conversation/:sender_id/:receiver_id", chat.checkConversation)
	.get("/:user_id", chat.getChats)
	.get("/user-state-available-status/:user_id/:toggle_status", chat.userStateAvailableStatus)
	.post("/view", chat.viewMessage)
	.post("/", chat.sendMessage)

module.exports = Route
