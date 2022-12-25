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
            misc.response(res, 200, false, "")
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
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    allUserExceptCurrentUserFcm: async (req, res) => {
        var userId = req.params.user_id
        var results = []

        try {
            var allUserExceptCurrentUserFcm = await Firebase.allUserExceptCurrentUserFcm(userId)
            if(allUserExceptCurrentUserFcm.length != 0) {
                for (const k in allUserExceptCurrentUserFcm) {
                    var token = allUserExceptCurrentUserFcm[k].token
                    results.push(token)
                }   
            } 
            misc.response(res, 200, false, "", results)
        } catch(e) {   
            console.log(e.message) // in-development
            misc.response(res, 400, true, "Server error")
        }
    }


}