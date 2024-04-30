const dontReferYourself = async (ctx, accountData) => {
  try {
    const referred = accountData.referralCount
    const replyText = `
*Please don't click your own link.*

Keep sharing your link with others.

\`${accountData.referralLink}\` _(Tap to copy)_    


Your have referred: *${referred==0 && `Nobody`}${referred==1 && `1 person`}${referred>1 && `${referred} people`}*
`;

    ctx.reply(replyText, { parse_mode: "Markdown" });
  } catch (error) {
    console.log(error);
    ctx.reply("An error occured. Please try again.");
  }
};

module.exports = dontReferYourself;
