// editBankAccountType.js
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const { localUrl } = require("../../../configFIles");

const editBankAccountType = (bot, chatId, userCookieJars) => {
  bot.sendMessage(chatId, "Please enter your new bank account type:");

  // Listen for the next message (new bank account type)
  bot.once("message", (accountTypeMessage) => {
    const newBankAccountType = accountTypeMessage.text;
    const cookieJar = userCookieJars.get(chatId);

    if (cookieJar) {
      const axiosInstance = wrapper(
        axios.create({
          jar: cookieJar,
          withCredentials: true,
        })
      );

      // First, fetch the user profile to get the user ID
      axiosInstance
        .get(`${localUrl}/login_register/profile`)
        .then((profileResponse) => {
          const userId = profileResponse.data.id; // Extract the user ID from the profile response

          // Send a request to update the bank account type with user ID
          return axiosInstance.patch(`${localUrl}/students/${userId}`, {
            bankaccounttype: newBankAccountType, // Use lowercase here
          });
        })
        .then((response) => {
          console.log("Response: " + response.data.bankaccounttype);
          console.log("Bank Account Type: " + newBankAccountType);
          // Check if the response indicates success
          if (response.data.bankaccounttype === newBankAccountType) {
            bot.sendMessage(
              chatId,
              "Bank Account Type Changed Successfully! 🎉"
            );
          } else {
            bot.sendMessage(
              chatId,
              "Failed to update bank account type: " + response.data.message
            );
          }
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            "An error occurred while updating: " + error.message
          );
        });
    } else {
      bot.sendMessage(chatId, "You need to log in first!");
    }
  });
};

module.exports = { editBankAccountType };
