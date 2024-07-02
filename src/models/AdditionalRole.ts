import mongoose, { mongo } from "mongoose";

const RoleSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    });

export default mongoose.model("AdditionalRole", RoleSchema);