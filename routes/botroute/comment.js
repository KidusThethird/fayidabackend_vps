const axios = require("axios");
const { localUrl } = require("../../configFIles");

const postComment = async (bot, chatId, commentText) => {
  try {
    const response = await axios.post(`${localUrl}/comments`, {
      text: commentText,
    });
    console.log("Code: " + response.status);

    if (response.status == 200) {
      // If the comment was successfully posted
      bot.sendMessage(chatId, "Your comment has been posted successfully! ✅");
    } else {
      bot.sendMessage(
        chatId,
        "Failed to post comment: " + response.data.message
      );
    }
  } catch (error) {
    bot.sendMessage(
      chatId,
      "An error occurred while posting your comment: " + error.message
    );
  }
};

module.exports = { postComment };
