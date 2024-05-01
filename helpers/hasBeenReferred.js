const User = require("../models/userModel");

const hasBeenReferred = async (chatId) => {
  try {
    // Find if any user has referred the chatId
    const user = await User.findOne({ referredUsers: { $in: [chatId] } });

    // If user is found, return true; otherwise, return false
    return { error: false, result: !!user };
  } catch (error) {
    console.error("Error checking if chatId has been referred:", error);
    return { error: true };
  }
};

module.exports = hasBeenReferred;
