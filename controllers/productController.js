import slugify from "slugify";
import productModel from "../models/productModel.js";
import fs from 'fs'

export const createProductController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        if (!name) {
            return res.send({ message: "Name is required" })
        }
        if (!description) {
            return res.send({ message: "description is required" })
        }
        if (!price) {
            return res.send({ message: "price is required" })
        }
        if (!category) {
            return res.send({ message: "category is required" })
        }
        if (!quantity) {
            return res.send({ message: "quantity is required" })
        }
        if (!shipping) {
            return res.send({ message: "shipping is required" })
        }

        if (photo && photo.size > 1000000) {
            return res.send({ message: "Photo is required and should be less than 1mb" })
        }


        const product = new productModel({ ...req.fields, slug: slugify(name) })
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()
        res.status(200).send({
            success: true,
            message: "Product created successfully",
            product
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

export const ProductsController = async (req, res) => {
    try {
        const products = await productModel.find({}).select("-photo").populate("category").limit(12).sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            message: "All products",
            countTotal: products.length,
            products
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

export const singleProductController = async (req,res) =>{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success:true,
            message:"A single product",
            product
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

export const productPhotoController = async (req,res) =>{
    try {
        const product = await productModel.findById(req.params.id).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
            return res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        })
    }
}

export const deleteProductController = async(req,res) =>{
    try {
        await productModel.findByIdAndDelete(req.params.id)
        res.status(200).send({
            success:true,
            message:"Product deleted successfully"
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

export const updateProductController = async (req,res) =>{
    try {
        const { name, description, price, category, quantity, shipping } = req.fields
        const { photo } = req.files

        if (!name) {
            return res.send({ message: "Name is required" })
        }
        if (!description) {
            return res.send({ message: "description is required" })
        }
        if (!price) {
            return res.send({ message: "price is required" })
        }
        if (!category) {
            return res.send({ message: "category is required" })
        }
        if (!quantity) {
            return res.send({ message: "quantity is required" })
        }
        if (!shipping) {
            return res.send({ message: "shipping is required" })
        }

        if (photo && photo.size > 1000000) {
            return res.send({ message: "Photo is required and should be less than 1mb" })
        }


        const product = await productModel.findByIdAndUpdate(req.params.id,{ ...req.fields, slug: slugify(name) },{new:true})
        if (photo) {
            product.photo.data = fs.readFileSync(photo.path)
            product.photo.contentType = photo.type
        }

        await product.save()
        res.status(200).send({
            success: true,
            message: "Product updated successfully",
            product
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