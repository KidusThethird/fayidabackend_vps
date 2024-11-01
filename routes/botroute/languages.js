// Store user preferences (could be in memory or a database for production)
const userPreferences = {}; // Temporary store, ideally use a database
let AccountT = "";
module.exports = {
  sendLanguageOptions: function (bot, chatId, accountType) {
    AccountT = accountType;
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
    let options = {};
    if (AccountT == "student") {
      options = {
        en: {
          postLoginOptions: "Here are your options after login:",
          clubs: "Clubs",
          profile: "View Profile",
          questions: "Questions",
          website: "Go to Website",
          comment: "Comment",
          changeLanguage: "Change Language",
          log_out: "Log Out to Start Menu",
        },
        am: {
          postLoginOptions: "ከመግባት በኋላ አማራጮችዎ እነሆ ናቸው፡፡",
          clubs: "ክለቦች",
          profile: "መገለጫ ይመልከቱ",
          questions: "ጥያቄዎች",
          website: "ድረ-ገጹን ይጎብኙ",
          comment: "አስተያየት",
          resources: "መማሪያ ዶክመንቶች",
          changeLanguage: "ቋንቋ ይቀይሩ",
          log_out: "ወደ ዋናው መውጫ መመለስ",
        },
      };

      bot.sendMessage(chatId, options[language].postLoginOptions, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: options[language].profile,
                callback_data: "view_profile",
              },
            ],
            [{ text: options[language].clubs, callback_data: "clubs" }],
            [{ text: options[language].questions, callback_data: "questions" }],
            [
              {
                text: options[language].website,
                callback_data: "go_to_website",
              },
            ],
            [{ text: options[language].comment, callback_data: "comment" }],
            [
              {
                text: options[language].changeLanguage,
                callback_data: "change_language",
              },
            ],
            [
              {
                text: options[language].log_out,
                callback_data: "log_out_page",
              },
            ],
          ],
        },
      });
    } else if (AccountT == "agent") {
      options = {
        en: {
          postLoginOptions: "Here are your options after login:",
          edit: "Edit Profile",
          profile: "View Profile",
          list: "Student List",
          transaction: "Transaction",
          comment: "Comment",
          changeLanguage: "Change Language",
          log_out: "Log Out",
        },
        am: {
          postLoginOptions: "ከመግባት በኋላ አማራጮችዎ እነሆ ናቸው፡፡",
          edit: "መገለጫ ይቀይሩ",
          profile: "መገለጫ መልከቱ",
          list: "የተማሪዎች ዝርዝር",
          transaction: "የገዘብ ዝውውር",
          comment: "አስተያየት",
          changeLanguage: "ቋንቋ ይቀይሩ",
          log_out: "ወደ ዋናው መውጫ",
        },
      };

      bot.sendMessage(chatId, "What would you like to do next?", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: options[language].profile,
                callback_data: "view_profile_agent",
              },
            ],
            [
              {
                text: options[language].edit,
                callback_data: "edit_profile",
              },
            ],
            [
              {
                text: options[language].list,
                callback_data: "list_students",
              },
            ],
            [
              {
                text: options[language].transaction,
                callback_data: "transaction",
              },
            ],
            [
              {
                text: options[language].comment,
                callback_data: "comment",
              },
            ],
            [
              {
                text: options[language].changeLanguage,
                callback_data: "change_language_agent",
              },
            ],
            [
              {
                text: options[language].log_out,
                callback_data: "log_out_page",
              },
            ],
          ],
        },
      });
    } else {
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

      bot.sendMessage(chatId, "What would you like to do next?", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: options[language].loginStudent,
                callback_data: "login_student",
              },
            ],
            [
              {
                text: options[language].loginAgent,
                callback_data: "login_agent",
              },
            ],
            [
              {
                text: options[language].signUpStudent,
                callback_data: "sign_up_student",
              },
            ],
            [
              {
                text: options[language].getInfo,
                callback_data: "get_info",
              },
            ],
            [
              {
                text: options[language].getSupport,
                callback_data: "get_support",
              },
            ],
            [
              {
                text: options[language].changeLanguage,
                callback_data: "change_language_home",
              },
            ],
          ],
        },
      });
    }

    // Send the post-login options in the selected language
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
