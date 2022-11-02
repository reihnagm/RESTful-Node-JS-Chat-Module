const conn = require('../configs/db')

module.exports = {

  initFcm: (uid, userId, token)=> {
    return new Promise((resolve, reject) => {
    const query = `INSERT INTO user_tokens (uid, user_id, token) VALUES('${uid}', '${userId}', '${token}')
      ON DUPLICATE KEY UPDATE token = '${token}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  }
  
}