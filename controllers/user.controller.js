import User from "../models/User.js";
import { ErrorMessage } from "../utils/http-responses/error.js";
import { SuccessMessage } from "../utils/http-responses/success.js";

export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find();
        return next(SuccessMessage(200, "All Users.", {"users": users}));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error."));
    }
};

export const getById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user){
            return next(ErrorMessage(404, "User not found."));
        }
        return next(SuccessMessage(200, "User found.", {"user": user}));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error."));
    }
};