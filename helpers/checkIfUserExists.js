const bot = require("..");
const User = require("../models/userModel");

const checkIfUserExists = async (chatId) => {
  //chatId here is also userId
  try {
    const userData = await User.findOne({ chatId });
    if (!userData) {
      return false;
    }

    return userData
  } catch (error) {
    console.log(error);
    bot.telegram.sendMessage(chatId, "An error occured. Please try again.");
  }
};


module.exports=checkIfUserExists