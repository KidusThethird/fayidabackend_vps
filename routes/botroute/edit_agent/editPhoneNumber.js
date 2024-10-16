// editPhoneNumber.js
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const { localUrl } = require("../../../configFIles");

const editPhoneNumber = (bot, chatId, userCookieJars) => {
  bot.sendMessage(chatId, "Please enter your new phone number:");

  // Listen for the next message (new phone number)
  bot.once("message", (phoneNumberMessage) => {
    const newPhoneNumber = phoneNumberMessage.text;
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

          // Send a request to update the phone number with user ID
          return axiosInstance.patch(`${localUrl}/students/${userId}`, {
            phoneNumber: newPhoneNumber, // Use phoneNumber in the request body
          });
        })
        .then((response) => {
          console.log("Response: " + response.data.phoneNumber);
          console.log("Phone Number: " + newPhoneNumber);
          // Check if the response indicates success
          if (response.data.phoneNumber === newPhoneNumber) {
            bot.sendMessage(chatId, "Phone Number Changed Successfully! 🎉");
          } else {
            bot.sendMessage(
              chatId,
              "Failed to update phone number: " + response.data.message
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

module.exports = { editPhoneNumber };
