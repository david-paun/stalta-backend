import User, { UserDocument } from '../../models/User.js';
import ClearanceLevel, { ClearanceLevelDocument } from '../../models/ClearanceLevel.js';

export const hasAdminClearance = async (user: UserDocument): Promise<boolean> => {
    await user.populate<{ clearanceLevel: ClearanceLevelDocument }>("clearanceLevel", "level");
  
    const populatedUser = user as UserDocument & { clearanceLevel: ClearanceLevelDocument };
  
    return populatedUser.clearanceLevel.level === "Admin";
  };

  export const hasUserClearance = async (user: UserDocument): Promise<boolean> => {
    await user.populate<{ clearanceLevel: ClearanceLevelDocument }>("clearanceLevel", "level");
    const populatedUser = user as UserDocument & { clearanceLevel: ClearanceLevelDocument };
  
    return populatedUser.clearanceLevel ? ["Admin", "User"].includes(populatedUser.clearanceLevel.level) : false;
  };
  
  export const hasGuestClearance = async (user: UserDocument): Promise<boolean> => {
    await user.populate<{ clearanceLevel: ClearanceLevelDocument }>("clearanceLevel", "level");
    const populatedUser = user as UserDocument & { clearanceLevel: ClearanceLevelDocument };
  
    return populatedUser.clearanceLevel ? ["Admin", "User", "Guest"].includes(populatedUser.clearanceLevel.level) : false;
  };
