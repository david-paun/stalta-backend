import jwt from "jsonwebtoken";
import { ErrorMessage } from "../http-responses/error.js";


export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return next(ErrorMessage(401, "You're not authenticated."));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, userData)=> {
        if(err){
            return next(ErrorMessage(403, "Invalid token."));
        }
        console.log("userData: ", userData);
        req.userData = userData;
        next();
    });
};
