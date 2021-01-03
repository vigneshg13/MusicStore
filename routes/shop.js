const path = require('path');
const express = require('express');
const shopController = require('../controllers/shop');
const isAuth = require('../middleware/isAuth');

//const rootDir = require('../util/path');


const route = express.Router();

route.get("/",shopController.getIndex);

route.get("/products/:productId",shopController.getProduct);

route.get("/products",shopController.getProducts);

route.get('/cart',isAuth.isAuth,shopController.getCart);

route.post('/cart',isAuth.isAuth,shopController.postCart);

route.post('/cart-delete-item',isAuth.isAuth,shopController.postCartDeleteItems);

route.get('/checkout',isAuth.isAuth,shopController.getCheckout);

route.get('/checkout/success',isAuth.isAuth,shopController.postOrders);

route.get('/checkout/cancel',isAuth.isAuth,shopController.getCheckout);

route.get('/orders',isAuth.isAuth,shopController.getOrders);

//route.post('/create-order',isAuth.isAuth,shopController.postOrders);

route.get('/checkout',isAuth.isAuth,shopController.getCheckout);


module.exports = route; 