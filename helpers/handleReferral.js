const handleReferral = async (ctx, linkOwnerData) => {
  try {
    //Reward link owner
    const idOfReferredUser = ctx.from.id;
    const { referralCount, referredUsers } = linkOwnerData;

    const updatedLinkOwnerData = Object.assign(linkOwnerData, {
      referralCount: referralCount + 1,
      referredUsers: [...referredUsers, idOfReferredUser],
    });

    await updatedLinkOwnerData.save();

    const replyText = `
*Welcome to FIB Bank!*

Referred by: @${linkOwnerData.username}

احصل على رابط الاحالة الخاص بك لنشره والفوز بالجائزة المالية بعد انضمامك الى قناتنا في تلغرام ومتابعتنا على انستغرام`;

    const replyMarkup = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "انضم لقروبنا على تلغرام", url: "https://t.me/FIB_Bank" }],
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

    ctx.reply(replyText, { ...replyMarkup, parse_mode:"Markdown" });
  } catch (error) {
    console.log(error);
    ctx.reply("An error occured. Please try again");
  }
};

module.exports = handleReferral;
