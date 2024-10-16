// editFirstName.js
const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const { localUrl } = require("../../../configFIles");

const editFirstName = (bot, chatId, userCookieJars) => {
  bot.sendMessage(chatId, "Please enter your new first name:");

  // Listen for the next message (new first name)
  bot.once("message", (nameMessage) => {
    const newFirstName = nameMessage.text;
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

          // Send a request to update the first name with user ID
          return axiosInstance.patch(`${localUrl}/students/${userId}`, {
            firstName: newFirstName,
          });
        })
        .then((response) => {
          console.log("Response: " + response.data.firstName);
          console.log("FirstName: " + newFirstName);
          // Check if the response indicates success
          if (response.data.firstName === newFirstName) {
            bot.sendMessage(chatId, "First Name Changed Successfully! 🎉");
          } else {
            bot.sendMessage(
              chatId,
              "Failed to update first name: " + response.data.message
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

module.exports = { editFirstName };
