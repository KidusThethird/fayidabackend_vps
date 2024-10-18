const languages = require("./languages"); // Import languages module to access user preferences

module.exports = {
  sendPostLoginOptions: (bot, chatId) => {
    // Get the user's language preference (default to English if not set)
    const language = languages.getUserLanguage(chatId);

    // Translation for both languages
    const messages = {
      en: {
        viewProfile: "View Profile",
        clubs: "Clubs",
        questions: "Questions",
        website: "Go to Website",
        comment: "Comment",
        changeLanguage: "Change Language",
        whatNext: "What would you like to do next?",
      },
      am: {
        viewProfile: "መገለጫ ይመልከቱ",
        clubs: "ክለቦች",
        questions: "ጥያቄዎች",
        website: "ወደ ድህረገፅ ይሂዱ",
        comment: "አስተያየት",
        changeLanguage: "ቋንቋ ይቀይሩ",
        whatNext: "በሚቀጥለው ምን መደምሰስ ትፈልጋለህ?",
      },
    };

    // Choose the right language set
    const options = messages[language];

    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: options.viewProfile, callback_data: "view_profile" }],
          [{ text: options.clubs, callback_data: "clubs" }],
          [{ text: options.questions, callback_data: "questions" }],
          [{ text: options.website, callback_data: "go_to_website" }],
          [{ text: options.comment, callback_data: "comment" }],
          [{ text: options.changeLanguage, callback_data: "change_language" }],
        ],
      },
    };

    bot.sendMessage(chatId, options.whatNext, keyboard);
  },

  sendClubOptions: (bot, chatId) => {
    const language = languages.getUserLanguage(chatId);

    const messages = {
      en: {
        chooseClub: "Choose a club:",
        grade9: "Grade 9 Club",
        grade10: "Grade 10 Club",
        grade11: "Grade 11 Club",
        grade12: "Grade 12 Club",
        others: "Others",
      },
      am: {
        chooseClub: "ክለብ ይምረጡ:",
        grade9: "የ 9ኛ ክፍል ክለብ",
        grade10: "የ 10ኛ ክፍል ክለብ",
        grade11: "የ 11ኛ ክፍል ክለብ",
        grade12: "የ 12ኛ ክፍል ክለብ",
        others: "ሌሎች",
      },
    };

    const options = messages[language];

    const clubKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: options.grade9, callback_data: "grade_9_club" }],
          [{ text: options.grade10, callback_data: "grade_10_club" }],
          [{ text: options.grade11, callback_data: "grade_11_club" }],
          [{ text: options.grade12, callback_data: "grade_12_club" }],
          [{ text: options.others, callback_data: "others_club" }],
        ],
      },
    };

    bot.sendMessage(chatId, options.chooseClub, clubKeyboard);
  },

  handleClubCallback: (bot, chatId, callbackData) => {
    const language = languages.getUserLanguage(chatId);

    const messages = {
      en: {
        grade9: "Redirecting to Grade 9 Club...",
        grade10: "You clicked Grade 10 Club.",
        grade11: "You clicked Grade 11 Club.",
        grade12: "You clicked Grade 12 Club.",
        others: "You clicked Others.",
      },
      am: {
        grade9: "ወደ 9ኛ ክፍል ክለብ በመሄድ ላይ...",
        grade10: "የ 10ኛ ክፍል ክለብ አስተካክለህ ነህ።",
        grade11: "የ 11ኛ ክፍል ክለብ አስተካክለህ ነህ።",
        grade12: "የ 12ኛ ክፍል ክለብ አስተካክለህ ነህ።",
        others: "ሌሎች አስተካክለህ ነህ።",
      },
    };

    const response = messages[language];

    if (callbackData === "grade_9_club") {
      bot.sendMessage(chatId, response.grade9, {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: response.grade9, // URL link to Grade 9 Club
                url: "https://t.me/fayidaacademy_grade9_club",
              },
            ],
          ],
        },
      });
    } else if (callbackData === "grade_10_club") {
      bot.sendMessage(chatId, response.grade10);
    } else if (callbackData === "grade_11_club") {
      bot.sendMessage(chatId, response.grade11);
    } else if (callbackData === "grade_12_club") {
      bot.sendMessage(chatId, response.grade12);
    } else if (callbackData === "others_club") {
      bot.sendMessage(chatId, response.others);
    }
  },
};
