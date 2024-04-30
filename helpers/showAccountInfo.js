const showAccountInfo = async (ctx, userData, usedALink) => {
  try {
    const part1Text = `
 *You already have an account.*\n\n
 `;
    //If existing user clicked a link, show this text first, then their account info
    if (usedALink) {
      ctx.reply(part1Text, { parse_mode: "Markdown" });
    }
const referred = userData.referralCount

    const replyText = `
Keep sharing your link with others.

\`${userData.referralLink}\` _(Tap to copy)_    


Your have referred: *${referred==0 && `Nobody`}${referred==1 && `1 person`}${referred>1 && `${referred} people`}*
`;
    ctx.reply(replyText, { parse_mode: "Markdown" });
  } catch (error) {
    console.log(error);
    ctx.reply("An error occured. Please try again.");
  }
};
module.exports = showAccountInfo;
