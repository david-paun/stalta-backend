import AdditionalRole from '../models/AdditionalRole.js';
import ClearanceLevel from '../models/ClearanceLevel.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { SuccessMessage } from '../utils/http-responses/success.js';
import { ErrorMessage } from '../utils/http-responses/error.js';
import jwt from 'jsonwebtoken';
import { getById } from './user.controller.js';
import { hasAdminClearance } from '../utils/clearance/clearanceLevel.js';



export const register = async (req, res, next) => {
    try {
        const clearanceLevel = await ClearanceLevel.findOne({level: 'User'});
        console.log(clearanceLevel);
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
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); 
    }
};


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email}).populate("clearanceLevel", "level");
        if(!user){
            return next(ErrorMessage(404, "User not found.")); 
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return next(ErrorMessage(404, "Wrong password.")); 
        }
        const token = jwt.sign(
            {
                id: user._id,
                clearanceLevel: user.clearanceLevel,
                additionalRoles: user.additionalRoles
            },
            process.env.JWT_SECRET
        );
        //hasAdminClearance(user);
        return next(SuccessMessage(200, "Login successful.", { "user": user}, {"token": token}));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); 
    }
};

export const elevateUser = async (req, res, next) => {
    try {
        if(!req.params.id){
            return next(ErrorMessage(500, "Internal Server Error.")); 
        }
        const userId = req.params.id;

        try {
            const user = await User.findById(userId);
            if(!user){
                return next(ErrorMessage(404, "User not found."));
            }

            let requesterData;

            jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err, userData)=> {
                if(err){
                    return next(ErrorMessage(403, "Invalid token."));
                }
                requesterData = userData;
            });

            console.log("requesterData: ", requesterData.id, userId);

            if(requesterData.id===userId){
                return next(ErrorMessage(403, "You can not elevate your own privileges.")); 
            }

            

            let isAdmin = await hasAdminClearance(user);
            if(isAdmin){
                return next(ErrorMessage(403, "User is already admin.")); 
            }

            const adminClearanceLevel = await ClearanceLevel.findOne({level: 'Admin'});

            const newUserState = await User.findByIdAndUpdate(
                userId,
                {$set: {"clearanceLevel": adminClearanceLevel._id}},
                {new: true}
            );



            return next(SuccessMessage(200, "User is elevated to admin.", {"user": newUserState})); 


        } catch (error) {
            return next(ErrorMessage(500, "Internal Server Error.", error.stack));
        }

        
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack)); 
    }
};