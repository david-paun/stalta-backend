import mongoose, {Schema} from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        userName: {
            type: String,
            required: true,
            unique: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        profileImage: {
            type: String,
            required: false,
            default: "/utils/images/default-profile.jpg"
        },
        clearanceLevel: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ClearanceLevel"
        },
        additionalRoles: {
            type: [Schema.Types.ObjectId],
            ref: "AdditionalRole"
        }
    },
    {
        timestamps: true
    }
);

export default mongoose.model("User", UserSchema);