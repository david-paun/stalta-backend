import mongoose, { Schema, Document, Model, model } from 'mongoose';

// Interface for AdditionalRole
interface AdditionalRole {
    _id: Schema.Types.ObjectId;
    // Define other properties as needed
}

// Interface for ClearanceLevel
interface ClearanceLevel {
    _id: Schema.Types.ObjectId;
    // Define other properties as needed
}

// Interface for User with references
interface User extends Document {
    firstName: string;
    lastName: string;
    userName: string;
    email: string;
    password: string;
    profileImage?: string;
    clearanceLevel: Schema.Types.ObjectId | ClearanceLevel;
    additionalRoles: Array<Schema.Types.ObjectId | AdditionalRole>;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema = new Schema<User>(
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
            default: "/utils/images/default-profile.jpg"
        },
        clearanceLevel: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: "ClearanceLevel"
        },
        additionalRoles: {
            type: [{
                type: Schema.Types.ObjectId,
                ref: "AdditionalRole"
            }],
            default: []
        }
    },
    {
        timestamps: true
    }
);

// Define UserDocument type by intersecting Document and User interfaces
export type UserDocument = mongoose.Document & User;

// Create the User model using UserDocument
const User: Model<UserDocument> = model<UserDocument>('User', UserSchema);

export default User;
