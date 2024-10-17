const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { localUrl } = require("../../configFIles");

module.exports = {
  fetchQuestionsForGrade: (bot, chatId, userCookieJars) => {
    const cookieJar = userCookieJars.get(chatId);

    if (cookieJar) {
      const axiosInstance = wrapper(
        axios.create({
          jar: cookieJar,
          withCredentials: true,
        })
      );

      // Fetch user profile to get the Grade
      axiosInstance
        .get(`${localUrl}/login_register/profile`)
        .then((profileResponse) => {
          const { firstName, lastName, gread } = profileResponse.data;

          // Clear previous messages and show profile information
          bot.sendMessage(chatId, "Fetching your grade...").then(() => {
            bot.sendMessage(
              chatId,
              `Name: ${firstName} ${lastName}\nGrade: ${gread}`
            );

            // After fetching the profile, proceed to fetch questions based on the Grade
            axios
              .get(`http://localhost:5000/botquestions/filtergrade/${gread}`)
              .then((questionsResponse) => {
                const { text, image, imgUrl } = questionsResponse.data;

                // Prepare header and message
                let message = `Current question for Grade ${gread}:\n`;

                if (text) {
                  message += `\n${text}\n\n`; // Separate question text

                  // Check if there is an image and include it
                  if (image) {
                    bot.sendPhoto(chatId, imgUrl, {
                      caption: message + "Type your response and send.",
                    });
                  } else {
                    // If there's no image, just send the message with footer
                    message += "Type your response and send.";
                    bot.sendMessage(chatId, message);
                  }
                } else {
                  bot.sendMessage(
                    chatId,
                    "There is no active question right now."
                  );
                }
              })
              .catch((questionsError) => {
                bot.sendMessage(
                  chatId,
                  "An error occurred while fetching questions: " +
                    questionsError.message
                );
              });
          });
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            "An error occurred while fetching profile: " + error.message
          );
        });
    } else {
      bot.sendMessage(chatId, "You need to log in first!");
    }
  },
};
