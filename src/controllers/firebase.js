require("dotenv").config()


const { v4: uuidv4 } = require('uuid')

const misc = require("../helpers/response")
const Firebase = require("../models/Firebase")

module.exports = {

    initFcm: async (req, res) => {
        var uid = uuidv4()
        var userId = req.body.user_id 
        var token = req.body.token
        try {
            await Firebase.initFcm(uid, userId, token)
            misc.response(res, 200, false, "", [])
        } catch(e) {
            console.log(e.meessage)
            misc.response(res, 400, true, "Server error")
        }
    },

    getUserFcm: async (req, res) => {
        var userId = req.params.user_id
        var result = ""
        try {
            var getUsers = await Firebase.getUserFcm(userId)
            if(getUsers.length != 0) {
                result = getUsers[0].token
            } 
            misc.response(res, 200, false, "", result)
        } catch(e) {
            console.log(e.message)
            misc.response(res, 400, true, "Server error")
        }
    },

    allUserFcm: async (req, res) => {
        var userId = req.params.user_id
        var result = []
        try {
            var allUserFcm = await Firebase.allUserFcm(userId)
            if(allUserFcm.length != 0) {
                for (const a in allUserFcm) {
                    var fcm = allUserFcm[a].token
                    result.push(fcm)
                }   
            } 
            misc.response(res, 200, false, "", result)
        } catch(e) {   
            console.log(e.message)
            misc.response(res, 400, true, "Server error")
        }
    }


}