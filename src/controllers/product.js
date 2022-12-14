require("dotenv").config()

const misc = require("../helpers/response")
const Product = require("../models/Product")
const Chat = require("../models/Chat")

module.exports = {

    getProducts: async (_, res) => {
        var results = []

        try {
            var products = await Product.getProducts()
            for (const i in products) {
                var product = products[i]
                var user = await Chat.getUsers(product.user_id)
                result.push({
                    "product_id": product.uid,
                    "product_name": product.name,
                    "product_image": product.image,
                    "product_price": product.price,
                    "user": {
                        "chat_id": product.store_id,
                        "id": user.uid,
                        "name": user.name,
                        "token": user.token ?? "-",
                        "image": user.image,
                        "is_online" : user.is_online == 0
                        ? false 
                        : true,
                        "last_active": user.last_active
                    }
                })
            }
            misc.response(res, 200, false, "", results)
        } catch (e) {
            console.log(e.messsage) // in-development
            misc.response(res, 400, true, "Server error")
        }
    },

    getProduct: async (req, res) => {
        var productId = req.params.product_id
        var results = []

        try {
            var products = await Product.getProduct(productId)
            for (const i in products) {
                var product = products[i]
                var user = await Chat.getUsers(product.user_id)
                results.push({
                    "product_id": product.uid,
                    "product_name": product.name,
                    "product_image": product.image,
                    "product_price": product.price,
                    "user": {
                        "chat_id": product.store_id,
                        "id": user.uid,
                        "name": user.name,
                        "token": user.token ?? "-",
                        "image": user.image,
                        "is_online" : user.is_online == 0
                        ? false 
                        : true,
                        "last_active": user.last_active
                    }
                })
            }
            
            misc.response(res, 200, false, "", results)
        } catch (e) {
            console.log(e.messsage) // in-development
            misc.response(res, 400, true, "Server error")
        }
    }

}