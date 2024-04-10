import Role from '../models/Role.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';


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
        return res.status(200).send("User registered.");
    } catch (error) {
        next(error); // Pass the error to the next middleware function
    }
};


export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email});
        if(!user){
            return res.status(404).send("User not found!");
        }
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordCorrect){
            return res.status(404).send("Wrong password!");
        }
        return res.status(200).send("Login successful!");
    } catch (error) {
        next(error); // Pass the error to the next middleware function
    }
};