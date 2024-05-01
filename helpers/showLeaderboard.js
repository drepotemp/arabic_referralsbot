const User = require("../models/userModel");

// Function to get the price based on position or referral count if less than 10 users in the database
function getPrice(position) {
  switch (position) {
    case 1:
      return "7000$";
    case 2:
      return "4550$";
    case 3:
      return "2957$";
    case 4:
      return "1922$";
    case 5:
      return "1249$";
    case 6:
      return "812$";
    case 7:
      return "527$";
    case 8:
      return "343$";
    case 9:
      return "223$";
    case 10:
      return "144$";
    default:
      return ""; // If position is not in top 10, return empty string
  }
}

const showLeaderboard = async (bot, ctx) => {
  try {
    // Find users with non-zero referrals and sort them by referral count in descending order
    let topReferrers = await User.find({ referralCount: { $gt: 0 } })
      .sort({ referralCount: -1 })
      .limit(10);

    let message = "🔥 List of winners as top 10 referrals:\n\n";

    // Iterate over top referrers and construct the message
    if (topReferrers.length > 0) {
      topReferrers.forEach((user, index) => {
        const position = index + 1;
        const price = getPrice(position);
        message += `🎖${position}- ${price} @${user.username} invited ${user.referralCount} people\n\n`;
      });
    }

    message +=
      "\n📌 Note: The positions and winners change according to the competence and work of each person by publishing his own link and inviting the largest possible number of people to our group through his referral link that he obtains from the bot. The most widespread link is the leader and the one with the largest share.\n\n";
    message +=
      "[💠 Click here to join the First Bank of Iraq competition bot worth $20,000  💠](https://t.me/FIB_Prize_Bot)";

    // Send the message if users are found
    if (topReferrers.length > 0) {
        //For a private chat
      if (ctx) {
        await ctx.reply(message, { parse_mode: "Markdown" });
      } else {
        //In a group chat or channel
        await bot.telegram.sendMessage("@lalaurd", message, {
          parse_mode: "Markdown",
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = showLeaderboard;
