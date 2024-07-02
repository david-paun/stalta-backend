import jwt from "jsonwebtoken";
import { ErrorMessage } from "../http-responses/error.js";
import { hasAdminClearance } from "../clearance/clearanceLevel.js";
import User from "../../models/User.js";

export const verifyUser = async (req, res, next) => {   
    const user = await User.findById(req.userData.id);
    const isAdmin = await hasAdminClearance(user);
    if(req.userData.id === req.params.id || isAdmin){
        next();
    }
    else{
        return next(ErrorMessage(403, "You're not authorized."));
    }
};

export const verifyAdmin = async (req, res, next) => {
    const user = await User.findById(req.userData.id);
    const isAdmin = await hasAdminClearance(user);
        if(isAdmin){
            next();
        }
        else{
            return next(ErrorMessage(403, "You're not authorized."));
        }
};