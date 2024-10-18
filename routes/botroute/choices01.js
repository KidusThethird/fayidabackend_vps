// choiceRoute.js
const express = require("express");
const router = express.Router();

const sendChoiceOptions = (bot, chatId) => {
  const options = {
    reply_markup: {
      inline_keyboard: [
        [
          { text: "Login as a Student", callback_data: "login_student" },
          { text: "Login as an Agent", callback_data: "login_agent" },
        ],
        [{ text: "Sign Up as a Student", callback_data: "sign_up_student" }],
        [{ text: "Get Information", callback_data: "get_info" }],
        [{ text: "Get Support", callback_data: "get_support" }],
        [{ text: "Change Language", callback_data: "change_language_home" }],
      ],
    },
  };

  // Send the message with options
  bot.sendMessage(chatId, "Please choose an option:", options);
};

module.exports = { sendChoiceOptions };
