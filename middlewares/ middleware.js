import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET;

const  authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;


    if (!token) {
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    jwt.verify(token, JWT_SECRET    , (err, email) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid token' });
        }

        req.email = email;
        console.log('jwt verified email = ', email);
        next();
    });
};

export default authMiddleware;