const express = require('express');

const router = express.Router()
const IsAuth = require("./middlewares/userAuth");
const IsAdmin = require("./middlewares/adminAuth");
const userController = require("./controller/userController")
const productController = require("./controller/productController")
const signUpSchema = require("./validations/signupValidation");
const loginSchema = require("./validations/loginValidation");
const productSchema = require("./validations/productValidation")
const productDetailValidation = require("./validations/productDetailValidations")
const sanitizeEmptyStrings = require("./middlewares/sanitizer"); // or define inline

// userAuth and Routes start
router.post('/signup', sanitizeEmptyStrings, signUpSchema.userSignupSchema, userController.userSignUp);
router.post("/login", sanitizeEmptyStrings, loginSchema.loginSchema, userController.Login);
router.post('/changePassword', sanitizeEmptyStrings, IsAuth, userController.changePassword)
router.post('/forgotPassword', userController.forgotPassword)
router.post('/resetPassword', userController.resetPassword)
router.get('/dashboard', IsAuth, userController.dashboard)
// userAuth and Routes end

// Product Routes start
router.post('/addProducts', sanitizeEmptyStrings, IsAdmin, productSchema.productSchema, productController.addProduct)
router.post('/deleteProduct',sanitizeEmptyStrings, IsAdmin, productController.deleteProduct)
router.get('/getProducts', productController.getProducts)
// router.get('/getProductDetail',productDetailValidation.validateProductId, productController.getProductDetail)
router.get('/getProductDetail/:id', productDetailValidation.validateProductId, productController.getProductDetail)
//Product Routes end

module.exports = router