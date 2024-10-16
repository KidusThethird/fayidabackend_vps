// editBankAccountNumber.js
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

const editBankAccountNumber = (bot, chatId, userCookieJars) => {
  bot.sendMessage(chatId, "Please enter your new bank account number:");

  // Listen for the next message (new bank account number)
  bot.once("message", (accountNumberMessage) => {
    const newBankAccountNumber = accountNumberMessage.text;
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
        .get("http://localhost:5000/login_register/profile")
        .then((profileResponse) => {
          const userId = profileResponse.data.id; // Extract the user ID from the profile response

          // Send a request to update the bank account number with user ID
          return axiosInstance.patch(
            `http://localhost:5000/students/${userId}`,
            {
              backaccountnumber: newBankAccountNumber,
              // Use lowercase here
            }
          );
        })
        .then((response) => {
          console.log("Response: " + response.data.backaccountnumber);
          console.log("Bank Account Number: " + newBankAccountNumber);
          // Check if the response indicates success
          if (response.data.backaccountnumber === newBankAccountNumber) {
            bot.sendMessage(
              chatId,
              "Bank Account Number Changed Successfully! 🎉"
            );
          } else {
            bot.sendMessage(
              chatId,
              "Failed to update bank account number: " + response.data.message
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

module.exports = { editBankAccountNumber };
