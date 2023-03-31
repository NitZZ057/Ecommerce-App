import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";

export const createCategoryController = async (req, res) => {
    try {
        const { name } = req.body
        if (!name) {
            return res.status(401).send({ message: "Name is required" })
        }

        const existingCategory = await categoryModel.findOne({ name })
        if (existingCategory) {
            return res.status(200).send({
                success: true,
                message: "Category already exist"
            })
        }

        const category = await new categoryModel({ name, slug: slugify(name) }).save()
        return res.status(201).send({
            success: true,
            message: "New Category Created",
            category
        })


    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Category"
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {

        const { name } = req.body
        const { id } = req.params
        const category = await categoryModel.findByIdAndUpdate(id, { name, slug: slugify(name) }, { new: true })
        res.status(200).send({
            success: true,
            category,
            message: "Category updated successfully"
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            error,
            message: "Something went wrong"
        })
    }
}

export const categoryController = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: "All categories",
            categories
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}

export const singleCategoryController = async (req, res) => {
    try {
        const category = await categoryModel.findOne({ slug: req.params.slug })
        res.status(200).send({
            success: true,
            message: "A single Category",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        // const {id} = 
        await categoryModel.findByIdAndDelete(req.params.id)
        res.status(200).send({
            success:true,
            message:"Category deleted Successfully",
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Something went wrong",
            error
        })
    }
}