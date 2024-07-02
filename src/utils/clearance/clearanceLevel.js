export const hasAdminClearance = async (user) => {
    await user.populate("clearanceLevel", "level");
    return user.clearanceLevel.level === "Admin";
}; 

export const hasUserClearance = async (user) => {
    await user.populate("clearanceLevel", "level");
    return ["Admin", "User"].includes(user.clearanceLevel.level);
};

export const hasGuestClearance = async (user) => {
    await user.populate("clearanceLevel", "level");
    return ["Admin", "User", "Guest"].includes(user.clearanceLevel.level);
}; 