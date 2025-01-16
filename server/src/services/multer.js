/* 

// Ejemplo de clase, lo dejo por tener una referencia.

import multer from "multer";
import fs from "fs";
import path from "path";

const BASE_PATH = "public/uploads/products";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const productId = req.body.productId || "temp";
        const fullPath = path.join(BASE_PATH, productId);
        if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
        }
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

function fileFilter(req, file, cb) {
    if (file.mimetype === "image/jpeg" || file.mimetype === "image/png" || file.mimetype === "image/gif") {
        cb(null, true);
    } else {
        cb(new Error('Tipo de archivo no soportado'), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 1024 * 1024 * 5
    }
});

export default upload; */