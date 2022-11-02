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
            misc.response(res, 400, true, "Server Error")
        }
    }
}