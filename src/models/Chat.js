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
  },

  checkOnScreeen: (chatId, receiverId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT os.on_screen, ut.token 
      FROM on_screens os
      LEFT join user_tokens ut ON ut.user_id = '${receiverId}'
      WHERE os.user_id = '${receiverId}'
      AND os.chat_id = '${chatId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  checkConversation: (senderId, receiverId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT uid FROM chats 
      WHERE sender_id = '${senderId}' AND receiver_id = '${receiverId}'
      OR receiver_id = '${senderId}' AND sender_id = '${receiverId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getChats: (userId) => {
    return new Promise ((resolve, reject) => {
      const query = `
      SELECT c.uid, u.uid AS user_id, u.name, u.image, ut.token, u.is_online, u.last_active
      FROM chats c, users u
      JOIN user_tokens ut ON u.uid = ut.user_id
      WHERE  
        CASE 
            WHEN c.sender_id = '${userId}'
            THEN c.receiver_id = u.uid
            WHEN c.receiver_id = '${userId}'
            THEN c.sender_id = u.uid
        END` 
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getChat: (chatId, userId) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT c.uid, u.uid AS user_id, u.name, u.image, ut.token, u.is_online, u.last_active
      FROM chats c, users u
      JOIN user_tokens ut ON u.uid = ut.user_id
      WHERE  
        CASE 
            WHEN c.sender_id = '${userId}'
            THEN c.receiver_id = u.uid
            WHEN c.receiver_id = '${userId}'
            THEN c.sender_id = u.uid
        END
      AND c.uid = '${chatId}'` 
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getOnScreens: (chatId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT u.uid, u.name, os.on_screen FROM on_screens os
        INNER JOIN users u ON os.user_id = u.uid
        WHERE os.chat_id = '${chatId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getActivities: (chatId) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT u.name, u.uid AS user_id, ca.is_active FROM chat_activities ca 
      INNER JOIN users u ON u.uid = ca.user_id
      WHERE ca.chat_id = '${chatId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  getUsers: (userId) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT u.uid, u.image, u.name, ut.token, u.is_online, u.last_active 
      FROM users u
      LEFT JOIN user_tokens ut ON ut.user_id = u.uid
      WHERE u.uid = '${userId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result[0])
        }
      })
    })
  },

  getMessages: (chatId, userId) => {
    return new Promise ((resolve, reject) => {
      const query = `SELECT 
      DISTINCT m.uid,
      u.name AS sender_name,
      p.uid AS product_id, p.name AS product_name, p.image AS product_image,
      p.price AS product_price,
      m.sender_id, m.receiver_id,
      m.sent_time, m.content, m.image, m.is_read, 
      emt.name type
      FROM messages m 
      LEFT JOIN products p ON m.product_id = p.uid
      LEFT JOIN soft_delete_messages sdm ON sdm.message_id = m.uid
      INNER JOIN users u ON m.sender_id = u.uid
      INNER JOIN chats c ON c.uid = m.chat_id
      INNER JOIN enum_message_types emt ON emt.uid = m.type
      WHERE c.uid = '${chatId}' 
      AND (m.sender_id = '${userId}' 
      OR m.receiver_id = '${userId}')
      AND (sdm.message_id IS NULL OR sdm.user_id != '${userId}')
      ORDER BY m.sent_time DESC`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  checkSoftDeleteMessage: (messageId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT IF(EXISTS(
      SELECT *
      FROM soft_delete_messages
      WHERE message_id = '${messageId}'), 1, 0) AS isExist`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result[0])
        }
      })
    })
  },

  truncateSoftDeleteMessage: (messageId) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM soft_delete_messages WHERE message_id = '${messageId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  softDeleteMessage: (uid, messageId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO soft_delete_messages (uid, message_id, user_id) VALUES 
      ('${uid}', '${messageId}', '${userId}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  deleteMessage: (messageId) => {
    return new Promise ((resolve, reject) => {
      const query = `DELETE FROM messages WHERE uid = '${messageId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  insertChats: (uid, senderId, receiverId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO chats (uid, sender_id, receiver_id) 
      VALUES ('${uid}', '${senderId}', '${receiverId}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  insertActivities: (uid, chatId, userId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO chat_activities (uid, user_id, chat_id, is_active) 
      VALUES ('${uid}', '${userId}', '${chatId}', '0') ON DUPLICATE KEY UPDATE is_active = 0`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  insertMessages: (uid, chatId, senderId, receiverId, content, image, type, productId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO messages (uid, chat_id, sender_id, receiver_id, content, image, is_read, type, 
        product_id
      )
      VALUES ('${uid}', '${chatId}', '${senderId}', '${receiverId}', '${content}', '${image}', '0', '${type}',
        '${productId}'
      )`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    }) 
  },

  insertOnScreens: (uid, chatId, userId, on) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO on_screens (uid, chat_id, user_id, on_screen) 
      VALUES ('${uid}', '${chatId}', '${userId}', '${on}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  insertProductAttachs: (uid, productName, productImage, productPrice, messageId) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO product_attachs (uid, product_name, product_image, product_price) 
      VALUES('${uid}', '${productName}', '${productImage}', '${productPrice}', '${messageId}')`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  viewMessage: (chatId, userId, isRead) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE messages SET is_read = '${isRead}'
      WHERE receiver_id = '${userId}' 
      AND chat_id = '${chatId}' 
      AND is_read = 0`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  userStateTyping: (userId, chatId, isActive) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE chat_activities SET is_active = '${isActive}' 
      WHERE user_id = '${userId}' AND chat_id = '${chatId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  userStateAvailableStatus: (userId, toggleStatus) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE users SET is_online = '${toggleStatus}' WHERE uid = '${userId}'`
      conn.query(query, (e, result) => {
        if(e) {
          reject(new Error(e))
        } else {
          resolve(result)
        }
      })
    })
  },

  userStateScreen: (userId, chatId, onScreen) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE on_screens SET on_screen = '${onScreen}' 
      WHERE user_id = '${userId}' AND chat_id = '${chatId}'`
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