require("dotenv").config()
const misc = require("../helpers/response")
const jwt = require("jsonwebtoken")

module.exports = function(req, res, next) {
  
  const token = req.body.token || req.query.token || req.header("x-auth-token")
  
  if (!token) {
    return misc.response(res, 401, true, "No token, authorization denied.")
  }
  try {
    jwt.verify(token, process.env.SECRET_KEY, (e, decoded) => {
      if(e) {
        if(e.message === "jwt expired") {
          misc.response(res, 401, true, "Token expired.")
        } 
        if(e.message === "invalid token") {
          misc.response(res, 401, true, "Invalid token.")
        }
      }
      else {
        /*---------------------------------------------
        -- request.user = decoded.user 
        -- If you want specify getting request property
        -----------------------------------------------*/
        req.decoded = decoded
        next()
      }
    })
  }
  catch (err) {
    console.log(err.message) // in-development
    misc.response(res, 500, true, "Server error.")
  }

}
