import jwt from "jsonwebtoken";

export async function isAuthenticated(req, res, next) {
    try {
        const token = req.cookies?.token;
        if(!token){
            return res.status(401).json({message: "No estas autenticado"});
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
        
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message:"Error interno del servidor"
        })
    }
}