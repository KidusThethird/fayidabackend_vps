const languages = require("./languages");

module.exports = {
  sendSubjectOptions: (bot, chatId, grade) => {
    const language = languages.getUserLanguage(chatId);

    const messages = {
      en: {
        grade9: {
          title: "Choose a Grade 9 Club:",
          subjects: [
            {
              text: "Grade 9 Biology Club",
              url: "https://t.me/grade_9_biology_fayidaacademy",
            },
            {
              text: "Grade 9 Chemistry Club",
              url: "https://t.me/grade_9_chemistry_fayidaacademy",
            },
            {
              text: "Grade 9 Math Club",
              url: "https://t.me/grade_9_math_fayidaacademy",
            },
          ],
        },
        grade10: {
          title: "Choose a Grade 10 Club:",
          subjects: [
            {
              text: "Grade 10 Biology Club",
              url: "https://t.me/grade_10_biology_fayidaacademy",
            },
            {
              text: "Grade 10 Chemistry Club",
              url: "https://t.me/grade_10_chemistry_fayidaacademy",
            },
            {
              text: "Grade 10 Math Club",
              url: "https://t.me/grade_10_math_fayidaacademy",
            },
          ],
        },
        // Add Grade 11 and 12 options here similarly
      },
      am: {
        grade9: {
          title: "የ 9ኛ ክፍል ክለብ ይምረጡ:",
          subjects: [
            {
              text: "የ 9ኛ ክፍል የባዮሎጂ ክለብ",
              url: "https://t.me/grade_9_biology_fayidaacademy",
            },
            {
              text: "የ 9ኛ ክፍል የኬምስትሪ ክለብ",
              url: "https://t.me/grade_9_chemistry_fayidaacademy",
            },
            {
              text: "የ 9ኛ ክፍል የሂሳብ ክለብ",
              url: "https://t.me/grade_9_math_fayidaacademy",
            },
          ],
        },
        grade10: {
          title: "የ 10ኛ ክፍል ክለብ ይምረጡ:",
          subjects: [
            {
              text: "የ 10ኛ ክፍል የባዮሎጂ ክለብ",
              url: "https://t.me/grade_10_biology_fayidaacademy",
            },
            {
              text: "የ 10ኛ ክፍል የኬምስትሪ ክለብ",
              url: "https://t.me/grade_10_chemistry_fayidaacademy",
            },
            {
              text: "የ 10ኛ ክፍል የሂሳብ ክለብ",
              url: "https://t.me/grade_10_math_fayidaacademy",
            },
          ],
        },
        // Add Grade 11 and 12 options here similarly
      },
    };

    const options = messages[language][grade];

    const subjectKeyboard = {
      reply_markup: {
        inline_keyboard: [
          ...options.subjects.map((subject) => [
            {
              text: subject.text,
              url: subject.url,
            },
          ]),
          [
            {
              text: "Back to Main Menu",
              callback_data: "student_main_menu",
            },
          ],
        ],
      },
    };

    bot.sendMessage(chatId, options.title, subjectKeyboard);
  },
};
