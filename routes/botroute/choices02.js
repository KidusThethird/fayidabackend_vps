module.exports = {
  sendPostLoginOptions: (bot, chatId) => {
    const keyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "View Profile", callback_data: "view_profile" }],
          [{ text: "Clubs", callback_data: "clubs" }],
          [{ text: "Questions", callback_data: "questions" }],
          [{ text: "Go to Website", callback_data: "go_to_website" }],
          [{ text: "Change Language", callback_data: "change_language" }],
        ],
      },
    };
    bot.sendMessage(chatId, "What would you like to do next?", keyboard);
  },

  sendClubOptions: (bot, chatId) => {
    const clubKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Grade 9 Club", callback_data: "grade_9_club" }],
          [{ text: "Grade 10 Club", callback_data: "grade_10_club" }],
          [{ text: "Grade 11 Club", callback_data: "grade_11_club" }],
          [{ text: "Grade 12 Club", callback_data: "grade_12_club" }],
          [{ text: "Others", callback_data: "others_club" }],
        ],
      },
    };
    bot.sendMessage(chatId, "Choose a club:", clubKeyboard);
  },

  handleClubCallback: (bot, chatId, callbackData) => {
    if (callbackData === "grade_9_club") {
      // Correct URL format to open the group directly
      bot.sendMessage(chatId, "Redirecting to Grade 9 Club...", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Join Grade 9 Club",
                url: "https://t.me/fayidaacademy_grade9_club", // Correct URL format for the group
              },
            ],
          ],
        },
      });
    } else if (callbackData === "grade_10_club") {
      bot.sendMessage(chatId, "You clicked Grade 10 Club.");
    } else if (callbackData === "grade_11_club") {
      bot.sendMessage(chatId, "You clicked Grade 11 Club.");
    } else if (callbackData === "grade_12_club") {
      bot.sendMessage(chatId, "You clicked Grade 12 Club.");
    } else if (callbackData === "others_club") {
      bot.sendMessage(chatId, "You clicked Others.");
    }
  },
};
