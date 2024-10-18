// get_info.js
const { getUserLanguage } = require("./languages"); // Import language preference function

module.exports = {
  sendBotInfo: function (bot, chatId) {
    const language = getUserLanguage(chatId); // Get the user's preferred language

    const infoMessages = {
      en: `Welcome to Fayida Academy Bot! 🎓\n
This bot is designed to assist students with their academic journey, providing access to clubs, questions, and personalized options like editing profiles and viewing transactions. Stay connected and enhance your learning experience with Fayida Academy!`,
      am: `እንኳን ወደ ፋይዳ አካዳሚ ቦት በሰላም መጡ! 🎓\n
ይህ ቦት ተማሪዎችን በትምህርታቸው ጉዞ ላይ ለመርዳት ተዘጋጅቷል፣ ክለቦችን፣ ጥያቄዎችን እና የግል ምርጫዎችን ማስተካከልና ማረጋገጥ የሚያስችል እንዲሁም እይታዎችን ማየት ይረዳል። ፋይዳ አካዳሚን ተከታትሉና የማማርያ ተሞክሮ ይጨምሩ!`,
    };

    // Send the info message based on the user's language
    bot.sendMessage(chatId, infoMessages[language]);
  },
};
