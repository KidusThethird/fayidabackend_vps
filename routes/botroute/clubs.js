const languages = require("./languages");

module.exports = {
  sendClubOptions: (bot, chatId) => {
    const language = languages.getUserLanguage(chatId);

    const messages = {
      en: {
        chooseClub: "Choose a club:",
        grade9: "Grade 9 Clubs",
        grade10: "Grade 10 Clubs",
        grade11: "Grade 11 Clubs",
        grade12: "Grade 12 Clubs",
        others: "Others",
        main_menu: "Main Menu",
      },
      am: {
        chooseClub: "ክለብ ይምረጡ:",
        grade9: "የ 9ኛ ክፍል ክለብ",
        grade10: "የ 10ኛ ክፍል ክለብ",
        grade11: "የ 11ኛ ክፍል ክለብ",
        grade12: "የ 12ኛ ክፍል ክለብ",
        others: "ሌሎች",
        main_menu: "ወደ ዋናው ምርጫ",
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
          [{ text: options.others, callback_data: "main_menu" }],
          [{ text: options.main_menu, callback_data: "student_main_menu" }],
        ],
      },
    };

    bot.sendMessage(chatId, options.chooseClub, clubKeyboard);
  },
};
