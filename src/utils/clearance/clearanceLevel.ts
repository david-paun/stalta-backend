import User, { UserDocument } from '../../models/User.js';
import ClearanceLevel, { ClearanceLevelDocument } from '../../models/ClearanceLevel.js';

export const hasAdminClearance = async (user: UserDocument): Promise<boolean> => {
    await user.populate("clearanceLevel", "level");
    const clearanceLevel = user.clearanceLevel as ClearanceLevelDocument | null;
    return clearanceLevel?.level === "Admin";
};

export const hasUserClearance = async (user: UserDocument): Promise<boolean> => {
    await user.populate("clearanceLevel", "level");
    const clearanceLevel = user.clearanceLevel as ClearanceLevelDocument | null;
    return clearanceLevel ? ["Admin", "User"].includes(clearanceLevel.level) : false;
};

export const hasGuestClearance = async (user: UserDocument): Promise<boolean> => {
    await user.populate("clearanceLevel", "level");
    const clearanceLevel = user.clearanceLevel as ClearanceLevelDocument | null;
    return clearanceLevel ? ["Admin", "User", "Guest"].includes(clearanceLevel.level) : false;
};
