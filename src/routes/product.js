const express = require("express")
const Route = express.Router()
const product = require("../controllers/product")

Route
	.get("/", product.getProducts)

module.exports = Route
