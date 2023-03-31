import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { createCategoryController,updateCategoryController,categoryController,singleCategoryController,deleteCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

router.post('/create-category',requireSignIn,isAdmin,createCategoryController)
router.put('/update-category/:id',requireSignIn,isAdmin,updateCategoryController)
router.get('/categories',categoryController)
router.get('/single-category/:slug',singleCategoryController)
router.delete('/delete-category/:id',requireSignIn,isAdmin,deleteCategoryController)

export default router