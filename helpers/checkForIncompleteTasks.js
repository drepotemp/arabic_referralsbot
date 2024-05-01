const User = require("../models/userModel");
const hasBeenReferred = require("./hasBeenReferred");

const checkForIncompleteTasks = async (ctx, userId, clickedALink) => {
  try {
    //If they have already clicked someone's referral link before
    const alreadyReferred = await hasBeenReferred(userId);

    //(alreadyReferred) comes as an object in order to thoroughly confirm operation status

    //If an error prevented checking
    if (alreadyReferred.error) {
      return ctx.reply("An error occured. Please try again.");
    }

    //if user is already referred
    if (alreadyReferred.result) {
      //Check if they have no account
      const userData = await User.findOne({ chatId: userId });
      //If they don't have an account, it means they haven't completed their tasks
      if (!userData) {
        const replyText = clickedALink
          ? "*You have already been referred.*\n\nPlease complete your tasks below."
          : "Please complete your tasks below.";

        const replyMarkup = {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "انضم لقروبنا على تلغرام",
                  url: "https://t.me/FIB_Bank",
                },
              ],
              [{ text: "انضم لقناتنا على تلغرام", url: "t.me/FIB_Channel" }],
              [
                {
                  text: "تابعنا على انستغرام",
                  url: "https://www.instagram.com/fib_iraq/",
                },
              ],
              [
                {
                  text: "Click me when you're done.",
                  callback_data: "send_link",
                },
              ],
            ],
          },
        };

        return ctx.reply(replyText, { ...replyMarkup, parse_mode: "Markdown" });
      }
    }
  } catch (error) {
    console.log(error);
    return ctx.reply("An error occured. Please try again.");
  }
};

module.exports = checkForIncompleteTasks;
