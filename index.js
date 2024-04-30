const { Telegraf } = require("telegraf");
require("dotenv").config();
const express = require("express");
const app = express();
const { Schema, model, default: mongoose } = require("mongoose");
const { v1: uuidv1 } = require("uuid");
const bodyParser = require("body-parser");
const cors = require("cors");
const bot = new Telegraf(process.env.BOT_TOKEN);
const Queue = require("queue-promise");
const User = require("./models/userModel");
const checkIfUserExists = require("./helpers/checkIfUserExists");
const showAccountInfo = require("./helpers/showAccountInfo");
const dontReferYourself = require("./helpers/dontReferYourself");
const hasBeenReferred = require("./helpers/hasBeenReferred");
const checkForIncompleteTasks = require("./helpers/checkForIncompleteTasks");

// Create a queue instance
const queue = new Queue({
  concurrent: 25, // Process one request at a time
  interval: 3000, // Interval between dequeue operations (1 second)
});

mongoose
  .connect(process.env.URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
    console.log("Connected to db.");
  })
  .catch((err) => {
    console.log(`Error connecting to db: ${err}`);
  });

app.use(
  cors({
    origin: "*",
  })
);

// Parse URL-encoded bodies (deprecated in Express v4.16+)
app.use(bodyParser.urlencoded({ extended: false }));

// Parse JSON bodies
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const port = process.env.PORT || 8933;

mongoose
  .connect(process.env.URI)
  .then(() => {
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
    console.log("Connected to db.");
  })
  .catch((err) => {
    console.log(`Error connecting to db: ${err}`);
  });

bot.start(async (ctx) => {
  try {
    queue.enqueue(async () => {
      const userId = ctx.from.id;
      let inviteId = ctx.payload;
      let linkFirstChunk = "t.me/FIB_Prize_Bot?start=";

      //Check if user came via an invite link
      if (inviteId) {
        //Check if user has incomplete tasks
        await checkForIncompleteTasks(ctx, userId, true); //Use these arguments when they click a link

        //Check if link is valid
        const linkOwnerData = await User.findOne({
          referralLink: linkFirstChunk + inviteId,
        });

        //If the link is valid
        if (linkOwnerData) {
          //Check if user tried to refer themselves.
          if (linkOwnerData.chatId == userId) {
            return await dontReferYourself(ctx, linkOwnerData);
          }

          //If they didn't refer themselves, but they already have an account
          const userData = await checkIfUserExists(userId);
          if (userData) {
            return await showAccountInfo(ctx, userData, true);
          }

          //Hasn't done any of the above, so handle the referral
          return await handleReferral(ctx, linkOwnerData);
        }

        //If the link is invalid
        if (!linkOwnerData) {
          return ctx.reply(
            "Sorry that link is invalid. Please check and try again."
          );
        }
      }

      await checkForIncompleteTasks(ctx, userId); //Use these arguments if user started the bot but have incomplete tasks

      //If user already exists but they didn't click a link, show their account details
      const userData = await checkIfUserExists(userId);
      if (userData) {
        return showAccountInfo(ctx, userData);
      }

      const replyText = `
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

      ctx.reply(replyText, { ...replyMarkup });
    });
  } catch (error) {
    console.log(error);
    ctx.reply("An error occured. Please try again.");
  }
});

bot.action("send_link", async (ctx) => {
  queue.enqueue(async () => {
    try {
      const newReferralLink = `t.me/FIB_Prize_Bot?start=${uuidv1()}`;
      const newUser = new User({
        chatId: ctx.from.id,
        referralLink: newReferralLink,
        referredUsers: [],
        referralCount: 0,
        username: ctx.from.username,
      });

      await newUser.save();

      ctx.reply(
        `This is your referral link\n\n\`${newReferralLink}\`\n\nKeep sharing it to refer users`,
        { parse_mode: "Markdown" }
      );
    } catch (error) {
      console.log(error);
    }
  });
});

bot.command("account_status", async (ctx) => {
  queue.enqueue(async () => {
    try {
      const userDetails = await User.find({ chatId: ctx.from.id });

      const replyText = `
Username: *${userDetails.username}*

Your have referred: *${userDetails.referralCount} people*

Keep sharing your link with others.

\`${userDetails.referralLink}\` _(Tap to copy)_    
`;

      ctx.reply(replyText, { parse_mode: "Markdown" });
    } catch (error) {
      console.log(error);
      ctx.reply("An error occured. Please try again.");
    }
  });
});

// Set bot commands for Telegram
bot.telegram.setMyCommands([
  { command: "start", description: "Start the FIB Prize Bot" },
  {
    command: "account_status",
    description: "Check your referral account information",
  },
]);

bot.launch();

module.exports = bot;
