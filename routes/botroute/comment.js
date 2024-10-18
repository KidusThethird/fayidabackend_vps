const axios = require("axios");
const { localUrl } = require("../../configFIles");
const languages = require("./languages");

const postComment = async (bot, chatId, commentText) => {
  try {
    const response = await axios.post(`${localUrl}/comments`, {
      text: commentText,
    });
    console.log("Code: " + response.status);

    // Get the user's language preference
    const language = languages.getUserLanguage(chatId);

    // Define message translations
    const messages = {
      en: {
        success: "Your comment has been posted successfully! ✅",
        failure: "Failed to post comment: ",
        error: "An error occurred while posting your comment: ",
      },
      am: {
        success: "መልዕክትዎ በትክክል ተልኳል! ✅",
        failure: "መልዕክትዎ መላክ አልተቻለም።",
        error: "ደብዳቤዎን ለመላክ አልተቻለም።",
      },
    };

    const options = messages[language]; // Choose the appropriate messages based on language

    if (response.status === 200) {
      // If the comment was successfully posted
      bot.sendMessage(chatId, options.success);
    } else {
      bot.sendMessage(chatId, options.failure + response.data.message);
    }
  } catch (error) {
    const language = languages.getUserLanguage(chatId);
    const messages = {
      en: {
        error: "An error occurred while posting your comment: ",
      },
      am: {
        error: "መላክ አልተቻለም።",
      },
    };

    const errorMessage = messages[language].error; // Get the error message in the appropriate language
    bot.sendMessage(chatId, errorMessage + error.message);
  }
};

module.exports = { postComment };
