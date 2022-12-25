require("dotenv").config()

const misc = require("../helpers/response")
const Auth = require("../models/Auth")

module.exports = {
    login: async (req, res) => {
        var email = req.body.email
        var password = req.body.password
        
        try {
            var users = await Auth.login(email, password)
            if(users.length != 0) {
                misc.response(res, 200, false, "", users[0])
            } else {
                misc.response(res, 200, false, "", {})
            }
        } catch (e) {
            console.log(e.messsage) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },
}