import express from "express";
import { createProductController ,ProductsController,singleProductController,productPhotoController,deleteProductController,updateProductController} from "../controllers/productController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)
router.put('/update-product/:id',requireSignIn,isAdmin,formidable(),updateProductController)
router.get('/products',ProductsController)
router.get('/product/:slug',singleProductController)
router.get('/product-photo/:id',productPhotoController)
router.delete('/product/:id',deleteProductController)

export default router