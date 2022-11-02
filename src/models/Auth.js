const conn = require('../configs/db')

module.exports = {

  login: (email, password) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT u.id, u.uid, u.image, u.name, u.email, u.last_active, u.is_online, ut.token
      FROM users u 
      LEFT JOIN user_tokens ut ON u.uid = ut.user_id
      WHERE email = '${email}' AND password = '${password}'`
      conn.query(query, (e, result) => {
        console.log(e)
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

}