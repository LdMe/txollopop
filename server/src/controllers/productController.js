import { moveFiles } from "../services/fileService.js";
import Product from "../models/productModel.js";

async function createProduct(req, res) {
    try {
        const { name, description, price, category, owner } = req.body;
        
        // Crear el producto primero sin imágenes
        const product = await Product.create({
            name,
            description,
            price,
            category,
            owner,
            images: []
        });

        // Si hay archivos, moverlos a la carpeta del producto y actualizar las rutas
        if (req.files && req.files.length > 0) {
            const imagePaths = await moveFiles(req.files, product._id.toString());
            
            // Actualizar el producto con las rutas de las imágenes
            product.images = imagePaths;
            await product.save();
        }

        return res.status(201).json(product);
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error interno del servidor"
        });
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

async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product) {
            return res.status(404).json({
                message: "Producto no encontrado"
            });
        }

        // Eliminar las imágenes del producto
        await deleteProductImages(id);
        
        // Eliminar el producto
        await Product.findByIdAndDelete(id);

        return res.status(200).json({
            message: "Producto eliminado correctamente"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Error interno del servidor"
        });
    }
}

export default {
    createProduct,
    getAllProducts,
    getProduct,
    deleteProduct
}