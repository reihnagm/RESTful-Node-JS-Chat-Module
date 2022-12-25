require("dotenv").config()

const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const misc = require('../helpers/response')
const Chat = require('../models/Chat')

module.exports = {

    getChats: async (req, res) => {
        var userId = req.params.user_id
        var results = []

        try {
            var chats = await Chat.getChats(userId)
            for (const k in chats) {
                var chat = chats[k]

                var activitiesAssign = []
                var activities = await Chat.getActivities(chat.uid)
                for (const a in activities) {
                    var activity = activities[a]
                    activitiesAssign.push({
                        "chat_id": chat.uid,
                        "uid": activity.user_id,
                        "name": activity.name,
                        "is_active": activity.is_active == 0 ? false : true
                    })
                }
                var currentUser = await Chat.getUsers(userId)
                
                var membersAssign = [
                    {
                        "uid": currentUser.uid,
                        "name": currentUser.name,
                        "image": currentUser.image,
                        "token": currentUser.token,
                        "is_online": currentUser.is_online == 0 ? false : true,
                        "last_active": moment(currentUser.last_active).utc().format("YYYY-MM-DD HH:mm:ss") 
                    },
                    {
                        "uid": chat.user_id,
                        "name": chat.name,
                        "image": chat.image,
                        "token": chat.token,
                        "is_online": chat.is_online == 0 ? false : true,
                        "last_active": moment(chat.last_active).utc().format("YYYY-MM-DD HH:mm:ss") 
                    },
                ]
        
                var messagesAssign = []
                var messages = await Chat.getMessages(chat.uid, currentUser.uid)
                for (const me in messages) {
                    var message = messages[me]
                    messagesAssign.push({
                        "uid": message.uid,
                        "chat_id": chat.uid,
                        "content": message.content,
                        "image": message.image,
                        "product_id": message.product_id,
                        "product_name": message.product_name,
                        "product_image": message.product_image,
                        "product_price": message.product_price,
                        "sender_id": message.sender_id,
                        "sender_name": message.sender_name,
                        "receiver_id": message.receiver_id,
                        "is_read": message.is_read == 0 ? false : true,
                        "type": message.type,
                        "sent_time": moment(message.sent_time).format("YYYY-MM-DD HH:mm:ss")
                    })
                }

                var onScreenAssign = []
                var onScreens = await Chat.getOnScreens(chat.uid)
                for (const os in onScreens) {
                    var onscreen = onScreens[os]
                    onScreenAssign.push({
                        "chat_id": chat.uid,
                        "uid": onscreen.uid,
                        "name": onscreen.name,
                        "on_screen": onscreen.on_screen == 0 ? false : true
                    })
                }

                results.push({
                    "uid": chat.uid,
                    "current_user_id": userId,
                    "activity": activitiesAssign,
                    "onscreens": onScreenAssign,
                    "members": membersAssign,
                    "messages": messagesAssign
                })
            }

            misc.response(res, 200, false, "", results)
        } catch (e) {
            console.log(e.messsage) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    getChat: async (req, res) => {
        var chatId = req.params.chat_id
        var userId = req.params.user_id
        var results = []

        try {
            var chats = await Chat.getChat(chatId, userId)
            for (const k in chats) {
                var chat = chats[k]

                var activitiesAssign = []
                var activities = await Chat.getActivities(chat.uid)
                for (const a in activities) {
                    var activity = activities[a]
                    activitiesAssign.push({
                        "chat_id": chat.uid,
                        "uid": activity.user_id,
                        "name": activity.name,
                        "is_active": activity.is_active == 0 ? false : true
                    })
                }
                var currentUser = await Chat.getUsers(userId)
                
                var membersAssign = [
                    {
                        "uid": currentUser.uid,
                        "name": currentUser.name,
                        "image": currentUser.image,
                        "token": currentUser.token,
                        "is_online": currentUser.is_online == 0 ? false : true,
                        "last_active": moment(currentUser.last_active).utc().format("YYYY-MM-DD HH:mm:ss") 
                    },
                    {
                        "uid": chat.user_id,
                        "name": chat.name,
                        "image": chat.image,
                        "token": chat.token,
                        "is_online": chat.is_online == 0 ? false : true,
                        "last_active": moment(chat.last_active).utc().format("YYYY-MM-DD HH:mm:ss") 
                    },
                ]
        
                var messagesAssign = []
                var messages = await Chat.getMessages(chat.uid, currentUser.uid)
                for (const me in messages) {
                    var message = messages[me]
                    messagesAssign.push({
                        "uid": message.uid,
                        "chat_id": chat.uid,
                        "content": message.content,
                        "image": message.image,
                        "product_id": message.product_id,
                        "product_name": message.product_name,
                        "product_image": message.product_image,
                        "product_price": message.product_price,
                        "sender_id": message.sender_id,
                        "sender_name": message.sender_name,
                        "receiver_id": message.receiver_id,
                        "is_read": message.is_read == 0 ? false : true,
                        "type": message.type,
                        "sent_time": moment(message.sent_time).format("YYYY-MM-DD HH:mm:ss")
                    })
                }

                var onScreenAssign = []
                var onScreens = await Chat.getOnScreens(chat.uid)
                for (const os in onScreens) {
                    var onscreen = onScreens[os]
                    onScreenAssign.push({
                        "chat_id": chat.uid,
                        "uid": onscreen.uid,
                        "name": onscreen.name,
                        "on_screen": onscreen.on_screen == 0 ? false : true
                    })
                }

                results.push({
                    "uid": chat.uid,
                    "current_user_id": userId,
                    "activity": activitiesAssign,
                    "onscreens": onScreenAssign,
                    "members": membersAssign,
                    "messages": messagesAssign
                })
            
            }

            misc.response(res, 200, false, "", results)
        } catch (e) {
            console.log(e.messsage) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    checkOnScreen: async (req, res) => {
        var chatId = req.params.chat_id
        var receiverId = req.params.receiver_id
        var result = ""

        try {
            var checkOnScreen = await Chat.checkOnScreeen(chatId, receiverId)
            if(checkOnScreen.length == 0) {
                result = -1
            } else {
                result = checkOnScreen[0].on_screen
            }
            misc.response(res, 200, false, "", {
                "on_screen": result == 1 ? true : false,
            })
        } catch(e) {
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    checkConversation: async (req, res) => {
      var senderId = req.params.sender_id
      var receiverId = req.params.receiver_id
      var result = ""

      try {
        var checkConversation = await Chat.checkConversation(senderId, receiverId)
        if(checkConversation.length == 0) {
          result = "CONVERSATION_NOT_FOUND"
        } else {
          result = checkConversation[0].uid 
        }
        misc.response(res, 200, false, "", {
          "uid": result
        })
      } catch(e) {
        console.log(e.message) // in-development
        misc.response(res, 400, true, "Server error")
      }
    },

    initConversation: async (req, res) => {
        var activitiesId = uuidv4()
        var onScreenId = uuidv4()
        var chatId = req.body.chat_id
        var senderId = req.body.sender_id
        var receiverId = req.body.receiver_id

        try {
            await Promise.race([    
                Chat.insertChats(chatId, senderId, receiverId),
                Chat.insertActivities(activitiesId, chatId, senderId),
                Chat.insertActivities(activitiesId, chatId, receiverId),
                Chat.insertOnScreens(onScreenId, chatId, senderId, 0),
                Chat.insertOnScreens(onScreenId, chatId, receiverId, 0),
            ])
            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    sendMessage: async (req, res) => {  
        var messageId = req.body.message_id

        var chatId = req.body.chat_id
        var senderId = req.body.sender_id
        var receiverId = req.body.receiver_id
        var content = req.body.content
        var type = req.body.type
        var image = req.body.image != null ? req.body.image : "-"
        
        var productId = req.body.product_id != null ? req.body.product_id : "-"

        try {
            await Chat.insertMessages(messageId, chatId, senderId, receiverId, content, image, type, productId)
            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        } 
    },

    deleteMessage: async (req, res) => {
        var uid = uuidv4()
        var messageId = req.params.message_id
        var userId = req.params.user_id
        var softDelete = req.params.soft_delete

        if(softDelete) {
            try {
                var checkIfExistDelete = await Chat.checkSoftDeleteMessage(messageId)
                if(checkIfExistDelete.isExist == 1) {
                    await Promise.all([
                        Chat.truncateSoftDeleteMessage(messageId),
                        Chat.deleteMessage(messageId)
                    ])
                } else {
                    await Chat.softDeleteMessage(uid, messageId, userId)   
                }
                misc.response(res, 200, false, "", [])
            } catch(e) {
                console.log(e.message) // in-development
                misc.response(res, 400, true, "Server error")
            }
        } else {
            try {
                await Chat.deleteMessage(messageId)
                misc.response(res, 200, false, "")
            } catch(e) {
                console.log(e.message) // in-development
                misc.response(res, 400, true, "Server error")
            }
        }
    },

    viewMessage: async (req, res) => {
        var chatId = req.body.chat_id
        var userId = req.body.user_id
        var isRead = req.body.is_read

        try {
            await Chat.viewMessage(chatId, userId, isRead)
            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    userStateTyping: async(req, res) => {
        var userId = req.params.user_id
        var chatId = req.params.chat_id
        var isActive = req.params.is_active

        try {
            await Chat.userStateTyping(userId, chatId, isActive)
        } catch(e) {
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    userStateAvailableStatus: async (req, res) => {
        var userId = req.params.user_id
        var toggleStatus = req.params.toggle_status

        try {
            await Chat.userStateAvailableStatus(userId, toggleStatus)
            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    userStateScreen: async (req, res) => {
        var userId = req.params.user_id
        var chatId = req.params.chat_id
        var onScreen = req.params.on_screen
        
        try {
            await Chat.userStateScreen(userId, chatId, onScreen)
            misc.response(res, 200, false, "")
        } catch(e) {
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },
}