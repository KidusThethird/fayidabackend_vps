// editProfileOptions.js
const { getUserLanguage } = require("./languages"); // Import the function to get user's language preference

module.exports = {
  sendEditProfileOptions: (bot, chatId) => {
    const language = getUserLanguage(chatId); // Get the user's language preference

    // Define the text for both English and Amharic
    const options = {
      en: {
        editFirstName: "Edit First Name",
        editLastName: "Edit Last Name",
        editGrandName: "Edit Grand Name",
        editPhoneNumber: "Edit Phone Number",
        editBankAccountType: "Edit Bank Account Type",
        editBankAccountNumber: "Edit Bank Account Number",
        home: "Home",
      },
      am: {
        editFirstName: "የመጀመሪያ ስምን ይቀይሩ",
        editLastName: "የአናት ስምን ይቀይሩ",
        editGrandName: "የአያት ስምን ይቀይሩ",
        editPhoneNumber: "የስልክ ቁጥርን ይቀይሩ",
        editBankAccountType: "የባንክ ሂሳብ አይነትን ይቀይሩ",
        editBankAccountNumber: "የባንክ ሂሳብ ቁጥርን ይቀይሩ",
        home: "መነሻ",
      },
    };

    const editKeyboard = {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: options[language].editFirstName,
              callback_data: "edit_first_name",
            },
          ],
          [
            {
              text: options[language].editLastName,
              callback_data: "edit_last_name",
            },
          ],
          [
            {
              text: options[language].editGrandName,
              callback_data: "edit_grand_name",
            },
          ],
          [
            {
              text: options[language].editPhoneNumber,
              callback_data: "edit_phone_number",
            },
          ],
          [
            {
              text: options[language].editBankAccountType,
              callback_data: "edit_bank_account_type",
            },
          ],
          [
            {
              text: options[language].editBankAccountNumber,
              callback_data: "edit_bank_account_number",
            },
          ],
          [{ text: options[language].home, callback_data: "home" }],
        ],
      },
    };

    bot.sendMessage(
      chatId,
      language === "am" ? "ምን ማርትዕ ትፈልጋለህ/ች?" : "What would you like to edit?",
      editKeyboard
    );
  },
};
