// Store user preferences (could be in memory or a database for production)
const userPreferences = {}; // Temporary store, ideally use a database

module.exports = {
  sendLanguageOptions: function (bot, chatId) {
    bot.sendMessage(chatId, "Please select your language:", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "English", callback_data: "lang_en" }],
          [{ text: "አማርኛ", callback_data: "lang_am" }],
          // Add other languages as needed
        ],
      },
    });
  },

  setLanguage: function (bot, chatId, language) {
    // Store the user's language preference
    userPreferences[chatId] = language;

    // Respond to the user in the selected language
    const messages = {
      en: "Language has been changed to English.",
      am: "ቋንቋ ወደ አማርኛ ተቀይሯል.",
    };

    bot.sendMessage(chatId, messages[language]).then(() => {
      // After confirming the language change, redirect to the main choices
      this.updateBotLanguage(bot, chatId, language);
    });
  },

  updateBotLanguage: function (bot, chatId, language) {
    // Update bot's responses, options, etc., based on the selected language
    const options = {
      en: {
        postLoginOptions: "Here are your options after login:",
        clubs: "Clubs",
        profile: "View Profile",
        questions: "Questions",
        website: "Go to Website",
        comment: "Comment",
        changeLanguage: "Change Language",
      },
      am: {
        postLoginOptions: "ከመግባት በኋላ አማራጮችዎ እነሆ ናቸው፡፡",
        clubs: "ክለቦች",
        profile: "መገለጫ ይመልከቱ",
        questions: "ጥያቄዎች",
        website: "ድረ-ገጹን ይጎብኙ",
        comment: "አስተያየት",
        changeLanguage: "ቋንቋ ይቀይሩ",
      },
    };

    // Send the post-login options in the selected language
    bot.sendMessage(chatId, options[language].postLoginOptions, {
      reply_markup: {
        inline_keyboard: [
          [{ text: options[language].profile, callback_data: "view_profile" }],
          [{ text: options[language].clubs, callback_data: "clubs" }],
          [{ text: options[language].questions, callback_data: "questions" }],
          [{ text: options[language].website, callback_data: "go_to_website" }],
          [{ text: options[language].comment, callback_data: "comment" }],
          [
            {
              text: options[language].changeLanguage,
              callback_data: "change_language",
            },
          ],
        ],
      },
    });
  },

  // Getter for the language preference
  getUserLanguage: function (chatId) {
    return userPreferences[chatId] || "en"; // Default to English if not set
  },

  // Function to handle language in other parts of your bot
  getLanguageForOtherPages: function (chatId) {
    return this.getUserLanguage(chatId); // You can use this function wherever needed
  },
};
