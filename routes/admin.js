const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middleware/isAuth');

const routes = express.Router();

const products=[];

//paths are filtered /admin => GET
routes.get("/add-product",isAuth.isAuth,adminController.getAddProduct);

routes.get("/edit-product/:productId",adminController.getEditProduct);

routes.get("/products",isAuth.isAuth,adminController.getProducts);

routes.post("/delete-product",isAuth.isAuth,adminController.postDeleteProduct);

routes.post("/add-product",adminController.postAddProduct);

routes.post("/edit-product",adminController.postEditProduct);
 
 module.exports = routes;
 