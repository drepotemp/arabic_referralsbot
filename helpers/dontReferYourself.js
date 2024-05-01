const setReferredString = require("./setReferredString");

const dontReferYourself = async (ctx, accountData) => {
  try {
    const referred = accountData.referralCount
    const replyText = `
*Please don't click your own link.*

Keep sharing your link with others.

\`${accountData.referralLink}\` _(Tap to copy)_    


Your have referred: *${setReferredString(referred)}*
`;

    ctx.reply(replyText, { parse_mode: "Markdown" });
  } catch (error) {
    console.log(error);
    ctx.reply("An error occured. Please try again.");
  }
};

module.exports = dontReferYourself;
