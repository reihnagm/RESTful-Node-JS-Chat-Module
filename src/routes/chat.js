const express = require("express")
const Route = express.Router()
const chat = require("../controllers/chat")

Route
	.post("/init-conversation", chat.initConversation)
	.get("/check-conversation/:sender_id/:receiver_id", chat.checkConversation)
	.get("/check-on-screen/:chat_id/:receiver_id", chat.checkOnScreen)
	.get("/:user_id", chat.getChats)
	.get("/:chat_id/:user_id", chat.getChat)
	.get("/user-state-typing/:chat_id/:user_id/:is_active", chat.userStateTyping)
	.get("/user-state-available-status/:user_id/:toggle_status", chat.userStateAvailableStatus)
	.get("/user-state-screen/:chat_id/:user_id/:on_screen", chat.userStateScreen)
	.post("/view", chat.viewMessage)
	.post("/", chat.sendMessage)

module.exports = Route
