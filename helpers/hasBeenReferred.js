const User = require("../models/userModel");

const hasBeenReferred = async (userId) => {
  try {
    const user = await User.findOne({
      referredUsers: { $elemMatch: { userId } },
    });
    return { error: false, result: !!user };
    // Returns true if user is found, false otherwise
  } catch (error) {
    console.error("Error checking if user has been referred:", error);
    return { error: true };
  }
};

module.exports = hasBeenReferred