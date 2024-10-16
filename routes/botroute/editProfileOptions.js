// editProfileOptions.js
module.exports = {
  sendEditProfileOptions: (bot, chatId) => {
    const editKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Edit First Name", callback_data: "edit_first_name" }],
          [{ text: "Edit Last Name", callback_data: "edit_last_name" }],
          [{ text: "Edit Grade", callback_data: "edit_grade" }],
          [
            {
              text: "Edit Bank Account Type",
              callback_data: "edit_bank_account_type",
            },
          ],
          [
            {
              text: "Edit Bank Account Number",
              callback_data: "edit_bank_account_number",
            },
          ],
          [{ text: "Home", callback_data: "home" }],
        ],
      },
    };

    bot.sendMessage(chatId, "What would you like to edit?", editKeyboard);
  },
};
