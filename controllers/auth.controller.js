import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { SuccessMessage } from '../utils/http-responses/success.js';
import { ErrorMessage } from '../utils/http-responses/error.js';
import jwt from 'jsonwebtoken';



export const register = async (req, res, next) => {
    try {
        const role = await Role.find({role: 'User'});
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            userName: req.body.userName,
            email: req.body.email,
            password: hashPassword,
            roles: role
        });
        await newUser.save();
        return next(SuccessMessage(200, "User registered."));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); // Pass the error to the next middleware function
    }
};


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}).populate("roles", "role");
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
                isAdmin: user.isAdmin,
                roles: user.roles
            },
            process.env.JWT_SECRET
        );
        return next(SuccessMessage(200, "Login successful.", { "user": user}, {"token": token}));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); // Pass the error to the next middleware function
    }
};