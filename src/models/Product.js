const conn = require('../configs/db')

module.exports = {

  getProducts: () => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT uid, name, image, price, user_id, store_id FROM products`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getProduct: (uid) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT uid, name, image, price, user_id, store_id FROM products WHERE uid = '${uid}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

}