// choiceRoute.js
const express = require("express");
const router = express.Router();
const { getUserLanguage } = require("./languages"); // Import the function to get user's language preference

const sendChoiceOptions = (bot, chatId) => {
  const language = getUserLanguage(chatId); // Get the user's language preference

  // Define the text for both English and Amharic
  const options = {
    en: {
      loginStudent: "Login as a Student",
      loginAgent: "Login as an Agent",
      signUpStudent: "Sign Up as a Student",
      getInfo: "Get Information",
      getSupport: "Get Support",
      changeLanguage: "Change Language",
      prompt: "Please choose an option:",
    },
    am: {
      loginStudent: "በተማሪ ሂደት መግባት",
      loginAgent: "በወንበር ሂደት መግባት",
      signUpStudent: "በተማሪ ሂደት ይመዝገቡ",
      getInfo: "መረጃ ይውሰዱ",
      getSupport: "ድጋፍ ይውሰዱ",
      changeLanguage: "ቋንቋ ይለውጡ",
      prompt: "እባክዎ አንድ አማራጭ ይምረጡ:",
    },
  };

  const choiceKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: options[language].loginStudent,
            callback_data: "login_student",
          },
          { text: options[language].loginAgent, callback_data: "login_agent" },
        ],
        [
          {
            text: options[language].signUpStudent,
            callback_data: "sign_up_student",
          },
        ],
        [{ text: options[language].getInfo, callback_data: "get_info" }],
        [{ text: options[language].getSupport, callback_data: "get_support" }],
        [
          {
            text: options[language].changeLanguage,
            callback_data: "change_language_home",
          },
        ],
      ],
    },
  };

  // Send the message with options
  bot.sendMessage(chatId, options[language].prompt, choiceKeyboard);
};

module.exports = { sendChoiceOptions };
