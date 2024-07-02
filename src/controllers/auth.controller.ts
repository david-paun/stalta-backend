import { Request, Response, NextFunction } from 'express';
import ClearanceLevel from '../models/ClearanceLevel.js';
import User from '../models/User.js'
import bcrypt from 'bcryptjs';
import { successMessage } from '../utils/http-responses/success.js';
import { errorMessage } from '../utils/http-responses/error.js';
import jwt from 'jsonwebtoken';
import { hasAdminClearance } from '../utils/clearance/clearanceLevel.js';



export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const clearanceLevel = await ClearanceLevel.findOne({level: 'User'});
        if(!clearanceLevel){
            console.log("aaa");
            return next(errorMessage(500, "Clearance level USER does not exist."));
        }
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
        return next(successMessage(200, "User registered."));
    } catch (error:any) {
        return next(errorMessage(500, "Internal Server Error.", error.stack)); 
    }
};


export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findOne({email: req.body.email}).populate("clearanceLevel", "level");
        if(!user){
            return next(errorMessage(404, "User not found.")); 
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return next(errorMessage(404, "Wrong password.")); 
        }
                // Check if JWT_SECRET is defined
                if (!process.env.JWT_SECRET) {
                    throw new Error('JWT_SECRET not defined in environment variables');
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
        return next(successMessage(200, "Login successful.", { "user": user}, {"token": token}));
    } catch (error:any) {
        return next(errorMessage(500, "Internal Server Error.", error.stack)); 
    }
};

export const elevateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        if(!req.params.id){
            return next(errorMessage(500, "Internal Server Error.")); 
        }
        const userId = req.params.id;

        try {
            const user = await User.findById(userId);
            if(!user){
                return next(errorMessage(404, "User not found."));
            }

            let requesterData:any; //make it strongly typed later on

                            // Check if JWT_SECRET is defined
                            if (!process.env.JWT_SECRET) {
                                throw new Error('JWT_SECRET not defined in environment variables');
                            }

            jwt.verify(req.cookies.token, process.env.JWT_SECRET, (err: any, userData: any)=> {
                if(err){
                    return next(errorMessage(403, "Invalid token."));
                }
                requesterData = userData;
            });

            console.log("requesterData: ", requesterData.id, userId);

            if(requesterData.id===userId){
                return next(errorMessage(403, "You can not elevate your own privileges.")); 
            }

            

            let isAdmin = await hasAdminClearance(user);
            if(isAdmin){
                return next(errorMessage(403, "User is already admin.")); 
            }

            const adminClearanceLevel = await ClearanceLevel.findOne({level: 'Admin'});

                                        // Check if JWT_SECRET is defined
                                        if (!adminClearanceLevel) {
                                            throw new Error('ADMIN role is not defined in database.');
                                        }

            const newUserState = await User.findByIdAndUpdate(
                userId,
                {$set: {"clearanceLevel": adminClearanceLevel._id}},
                {new: true}
            );



            return next(successMessage(200, "User is elevated to admin.", {"user": newUserState})); 


        } catch (error:any) {
            return next(errorMessage(500, "Internal Server Error.", error.stack));
        }

        
    } catch (error:any) {
        return next(errorMessage(500, "Internal Server Error.", error.stack)); 
    }
};