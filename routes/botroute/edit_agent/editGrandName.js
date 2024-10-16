// editGrandName.js
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const { localUrl } = require("../../../configFIles");

const editGrandName = (bot, chatId, userCookieJars) => {
  bot.sendMessage(chatId, "Please enter your new grand name:");

  // Listen for the next message (new grand name)
  bot.once("message", (nameMessage) => {
    const newGrandName = nameMessage.text;
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

          // Send a request to update the grand name with user ID
          return axiosInstance.patch(`${localUrl}/students/${userId}`, {
            grandName: newGrandName,
          });
        })
        .then((response) => {
          console.log("Response: " + response.data.grandName);
          console.log("Grand Name: " + newGrandName);
          // Check if the response indicates success
          if (response.data.grandName === newGrandName) {
            bot.sendMessage(chatId, "Grand Name Changed Successfully! 🎉");
          } else {
            bot.sendMessage(
              chatId,
              "Failed to update grand name: " + response.data.message
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

module.exports = { editGrandName };
