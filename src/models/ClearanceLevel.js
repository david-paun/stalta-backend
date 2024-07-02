import mongoose, { mongo } from "mongoose";

const RoleSchema = mongoose.Schema(
    {
        level:{
            type: String,
            required: true,
            unique: true
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("ClearanceLevel", RoleSchema);