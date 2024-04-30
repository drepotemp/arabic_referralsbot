const dontReferYourself = async (ctx, accountData) => {
  try {
    const replyText = `
*Please don't click your own link.*

Keep sharing your link with others.

\`${accountData.referralLink}\` _(Tap to copy)_    


Your have referred: *${accountData.referralCount} people*
`;

    ctx.reply(replyText, { parse_mode: "Markdown" });
  } catch (error) {
    console.log(error);
    ctx.reply("An error occured. Please try again.");
  }
};

module.exports = dontReferYourself;
