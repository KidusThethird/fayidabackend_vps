const axios = require("axios");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");

// Function to prompt user for first name and update the profile
async function askForFirstName(bot, chatId, userCookieJars) {
  bot.sendMessage(chatId, "Please enter your new first name:");

  // Listen for the next message (new first name)
  bot.once("message", async (nameMessage) => {
    const newFirstName = nameMessage.text;

    // Get the cookie jar for the user
    const cookieJar = userCookieJars.get(chatId);

    if (!cookieJar) {
      return bot.sendMessage(chatId, "You need to log in first!");
    }

    // Create an axios instance with the user's cookie jar
    const axiosInstance = wrapper(
      axios.create({
        jar: cookieJar, // Use the user's cookie jar
        withCredentials: true,
      })
    );

    try {
      const response = await axiosInstance.patch(
        `http://localhost:5000/login_register/student/${getUserId(chatId)}`, // Update URL
        { firstName: newFirstName }
      );

      if (response.status === 200) {
        bot.sendMessage(chatId, "First name updated successfully! 🎉");
      } else {
        bot.sendMessage(chatId, "Failed to update first name.");
      }
    } catch (error) {
      console.error("Error updating first name:", error);
      bot.sendMessage(
        chatId,
        "An error occurred while updating: " + error.message
      );
    }
  });
}

// Function to retrieve the user ID from the cookie or a mapping
function getUserId(chatId) {
  // This function should implement how you retrieve the user ID from cookies or other storage.
  // For example, if you store the ID in the cookie, you might use a method to read it.
  // For now, return a placeholder or implement according to your logic.
  return "USER_ID"; // Replace this with the actual logic to get the user ID from the cookie.
}

module.exports = { askForFirstName };
