import Product from "../models/productModel.js";

async function createProduct(req,res){
    try {
        const {name,description,price,images,category,owner} = req.body;
        const product = await Product.create({
            name,
            description,
            price,
            images,
            category,
            owner
        })
        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}

async function getAllProducts(req,res){
    try {
        const {owner,category} = req.body;
        const filter = {};
        if(owner){
            filter.owner = owner;
        }
        if(category){
            filter.category = category;
        }
        const products = await Product.find(filter);
        return res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}

async function getProduct(req,res){
    try {
        const {id} = req.params;
        const product = await Product.findById(id);
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}

async function deleteProduct(req,res){
    try {
        const {id} = req.params;
        const product = await Product.findByIdAndDelete(id);
        return res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}

export default {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct
}