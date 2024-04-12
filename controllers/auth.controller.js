import AdditionalRole from '../models/AdditionalRole.js';
import ClearanceLevel from '../models/ClearanceLevel.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { SuccessMessage } from '../utils/http-responses/success.js';
import { ErrorMessage } from '../utils/http-responses/error.js';
import jwt from 'jsonwebtoken';
import { getById } from './user.controller.js';



export const register = async (req, res, next) => {
    try {
        const clearanceLevel = await ClearanceLevel.find({level: 'User'});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hashPassword,
            clearanceLevel: clearanceLevel
        });
        await newUser.save();
        return next(SuccessMessage(200, "User registered."));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); // Pass the error to the next middleware function
    }
};


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}).populate("clearanceLevel", "clearanceLevel");
        if(!user){
            return next(ErrorMessage(404, "User not found.")); // Pass the error to the next middleware function
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return next(ErrorMessage(404, "Wrong password.")); // Pass the error to the next middleware function
        }
        const token = jwt.sign(
            {
                id: user._id,
                clearanceLevel: user.clearanceLevel,
                additionalRoles: user.additionalRoles
            },
            process.env.JWT_SECRET
        );
        return next(SuccessMessage(200, "Login successful.", { "user": user}, {"token": token}));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); // Pass the error to the next middleware function
    }
};

export const elevateUser = async (req, res, next) => {
    try {
        if(!req.body.user){
            return next(ErrorMessage(500, "Internal Server Error.", error.stack)); // Pass the error to the next middleware function
        }
        const userId = req.body.user

        try {
            const user = await User.findById(req.params.id);
            if(!user){
                return next(ErrorMessage(404, "User not found."));
            }
            user.populate("clearanceLevel", "clearanceLevel");
            console.log(user);
            //implement privilege escalation only if it is requested by an admin, the user provided has to exist and must have current role as user
            //return next(SuccessMessage(200, "User is escalated to admin.", {"user": user}));
        } catch (error) {
            return next(ErrorMessage(500, "Internal Server Error."));
        }

        
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); // Pass the error to the next middleware function
    }
};