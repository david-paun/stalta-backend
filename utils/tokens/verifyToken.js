import jwt from "jsonwebtoken";
import { ErrorMessage } from "../http-responses/error.js";

export const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return next(ErrorMessage(401, "You're not authenticated."));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=> {
        if(err){
            return next(ErrorMessage(403, "Invalid token."));
        }
        req.user = user;
        next();
    });
};

export const verifyUser = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.id === req.params.id || req.user.isAdmin){
            next();
        }
        else{
            return next(ErrorMessage(403, "You're not authorized."));
        }
    });
};

export const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, ()=> {
        if(req.user.isAdmin){
            next();
        }
        else{
            return next(ErrorMessage(403, "You're not authorized."));
        }
    });
};