const express = require("express");
const router = express.Router();
const { sendChoiceOptions } = require("./choices01"); // Import sendChoiceOptions
const { getUserLanguage } = require("./languages"); // Import the function to get user's language preference

const sendWelcomeMessage = (bot, chatId, userName) => {
  const language = getUserLanguage(chatId); // Get the user's language preference

  // Define the welcome message text for both English and Amharic
  const welcomeMessages = {
    en: `*Welcome to Fayida Academy, ${userName}!* 🎉\n\nWe're happy to have you here. Fayida Academy is dedicated to providing high-quality educational resources to help you on your learning journey.`,
    am: `*ወደ ፋይይዳ አካዳሚ እንኳን ወደ በዓል መጡ, ${userName}!* 🎉\n\nእንደ ወይዘም እንደሚያገኝ ነኝ፡፡ ፋይይዳ አካዳሚ ወዳይ ያገኙ ወደ ድንጋይ መሰረት ታወልኝ ወሰንዝ ወዳይ ይደቡ ወለዳ ይደኝ።`,
  };

  // Send the welcome text message with Markdown parsing
  bot.sendMessage(chatId, welcomeMessages[language], {
    parse_mode: "Markdown",
  });

  // Image URL (replace with the actual URL or path)
  const imageUrl = "https://fayidaacademy.com/common_files/main/bannerx01.jpg";

  // Send the welcome image
  bot
    .sendPhoto(chatId, imageUrl, {
      caption:
        language === "am"
          ? "ይህ ከእኔ ወደ ሰው ወይዘም ወላዕለኝ!"
          : "Here's a welcome image just for you! 😊",
    })
    .then(() => {
      // After sending the image, display the choices
      sendChoiceOptions(bot, chatId); // Call the function to send choice options
    });
};

module.exports = { sendWelcomeMessage };
