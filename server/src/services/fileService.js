// src/services/fileService.js
import fs from 'fs';
import path from 'path';
import multer from 'multer';

const UPLOADS_DIR = 'public/uploads/products';

// Asegurar que el directorio de uploads existe
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configuración de multer
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        const productId = req.params.id || 'temp';
        const productDir = path.join(UPLOADS_DIR, productId);
        
        // Crear directorio si no existe
        if (!fs.existsSync(productDir)) {
            fs.mkdirSync(productDir, { recursive: true });
        }
        
        cb(null, productDir);
    },
    filename: function(req, file, cb) {
        // Generar nombre único manteniendo la extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, uniqueSuffix + ext);
    }
});

// Filtro de archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado'), false);
    }
};

export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    }
});

// Función para mover archivos de temp a carpeta final
export const moveFiles = async (files, productId) => {
    const finalDir = path.join(UPLOADS_DIR, productId);

    // Crear el directorio final si no existe
    if (!fs.existsSync(finalDir)) {
        fs.mkdirSync(finalDir, { recursive: true });
    }

    const newPaths = [];
    for (const file of files) {
        try {
            const oldPath = file.path; // Ruta temporal
            const newPath = path.join(finalDir, file.originalname); // Ruta final

            // Mover el archivo
            fs.renameSync(oldPath, newPath);

            // Guardar la ruta relativa para el producto
            newPaths.push(path.join('uploads','products', productId, file.originalname));
        } catch (error) {
            console.error(`Error moviendo el archivo ${file.originalname}:`, error);
            throw new Error(`Error moviendo el archivo ${file.originalname}`);
        }
    }

    return newPaths;
};

// Función para eliminar directorio de imágenes
export const deleteProductImages = async (productId) => {
    const productDir = path.join(UPLOADS_DIR, productId);
    if (fs.existsSync(productDir)) {
        fs.rmSync(productDir, { recursive: true, force: true });
    }
};