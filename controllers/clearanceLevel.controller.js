import ClearanceLevel from '../models/ClearanceLevel.js';
import { ErrorMessage } from '../utils/http-responses/error.js';
import { SuccessMessage } from '../utils/http-responses/success.js';

export const createClearanceLevel = async (req, res, next)=> {
    try {
        if(req.body.level && req.body.level!==''){
            const newClearanceLevel = new ClearanceLevel({ "level": req.body.level });
            await newClearanceLevel.save();
            return next(SuccessMessage(200, "Clearance Level Created."));
        }
        else{
            return next(ErrorMessage(400, "Bad Request."));
        }
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack));
    }
};

export const updateClearanceLevel = async (req, res, next)=>{
    try {
        const clearanceLevel = await ClearanceLevel.findById({_id: req.params.id});
        if(clearanceLevel){
            const newData = await ClearanceLevel.findByIdAndUpdate(
                req.params.id,
                {$set: req.body},
                {new: true}
            );
            return next(SuccessMessage(200, "Clearance Level updated!"));

        }
        return next(ErrorMessage(404, "Clearance Level not found!"));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack));
    }
};

export const getClearanceLevels = async (req, res, next) => {
    try {
        const clearanceLevels = await ClearanceLevel.find({});
        return next(SuccessMessage(200, "Clearance Level sent.", {"levels": clearanceLevels}));
    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack));
    }
};

export const deleteClearanceLevel = async (req, res, next) => {
    try {
        const clearanceLevelId = req.params.id;
        const clearanceLevel = await ClearanceLevel.findById({_id: clearanceLevelId});
        if(clearanceLevel){
            await ClearanceLevel.findByIdAndDelete(clearanceLevelId);
        return next(SuccessMessage(200, "Clearance Level Deleted!"));

        }
        return next(ErrorMessage(404, "Clearance Level not found!"));


    } catch (error) {
        return next(ErrorMessage(500, "Internal Server Error.", error.stack));
    }
};