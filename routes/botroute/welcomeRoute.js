const express = require("express");
const router = express.Router();
const { sendChoiceOptions } = require("./choices01"); // Import sendChoiceOptions

const sendWelcomeMessage = (bot, chatId, userName) => {
  // Welcome message text with the user's name
  const welcomeMessage = `
    *Welcome to Fayida Academy, ${userName}!* 🎉

    We're happy to have you here. Fayida Academy is dedicated to providing high-quality educational resources to help you on your learning journey.
  `;

  // Send the welcome text message
  bot.sendMessage(chatId, welcomeMessage, { parse_mode: "Markdown" });

  // Image URL (replace with the actual URL or path)
  const imageUrl = "https://fayidaacademy.com/common_files/main/bannerx01.jpg";

  // Send the welcome image
  bot
    .sendPhoto(chatId, imageUrl, {
      caption: "Here's a welcome image just for you! 😊",
    })
    .then(() => {
      // After sending the image, display the choices
      sendChoiceOptions(bot, chatId); // Call the function to send choice options
    });
};

module.exports = { sendWelcomeMessage };
