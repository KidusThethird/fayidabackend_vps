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
        resources: "Resources",
        whatNext: "What would you like to do next?",
        log_out: "Log Out to Start Menu",
      },
      am: {
        viewProfile: "መገለጫ ይመልከቱ",
        clubs: "ክለቦች",
        questions: "ጥያቄዎች",
        website: "ወደ ድህረገፅ ይሂዱ",
        comment: "አስተያየት",
        changeLanguage: "ቋንቋ ይቀይሩ",
        resources: "መማሪያ ዶክመንቶች",
        whatNext: "በሚቀጥለው ምን መደምሰስ ትፈልጋለህ?",
        log_out: "ወደ ዋናው መውጫ መመለስ",
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
          [{ text: options.resources, callback_data: "resources" }],
          [{ text: options.changeLanguage, callback_data: "change_language" }],
          [{ text: options.log_out, callback_data: "log_out_page" }],
          //   [{ text: "Log Out to main menu", callback_data: "log_out_page" }],
        ],
      },
    };

    bot.sendMessage(chatId, options.whatNext, keyboard);
  },
};
