const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { localUrl } = require("../../configFIles");
const languages = require("./languages"); // Import languages module

function sendResourcesMessage(bot, chatId, userCookieJars) {
  const cookieJar = userCookieJars.get(chatId);

  if (cookieJar) {
    const axiosInstance = wrapper(
      axios.create({
        jar: cookieJar,
        withCredentials: true,
      })
    );

    // Fetch the user's profile
    axiosInstance
      .get(`${localUrl}/login_register/profile`)
      .then((profileResponse) => {
        const { firstName, lastName, gread } = profileResponse.data;
        const language = languages.getUserLanguage(chatId);

        const messages = {
          en: {
            greeting: "Hello World!",
            profileInfo: `Profile Information:\nName: ${firstName} ${lastName}\nGrade: ${gread}`,
          },
          am: {
            greeting: "ሰላም ልዑል!",
            profileInfo: `የግል መረጃ:\nስም: ${firstName} ${lastName}\nደረጃ: ${gread}`,
          },
        };

        // Send greeting and profile information
        bot.sendMessage(chatId, messages[language].greeting).then(() => {
          bot.sendMessage(chatId, messages[language].profileInfo);

          // Fetch resources based on user's grade
          axiosInstance
            .get(`${localUrl}/resources/filtered_with_grade/${gread}`)
            .then((resourceResponse) => {
              const resources = resourceResponse.data;

              // Loop through resources and send only the PDF file with title, grade, and description
              resources.forEach((resource) => {
                const { title, fileDescription, grade, fileUrl } = resource;

                // Send the PDF file with title, grade, and description in the caption
                bot
                  .sendDocument(chatId, fileUrl, {
                    caption: `${title} - ${grade}\n${fileDescription}`,
                  })
                  .catch((error) => {
                    bot.sendMessage(
                      chatId,
                      `Error sending file: ${error.message}`
                    );
                  });
              });
            })
            .catch((resourceError) => {
              bot.sendMessage(
                chatId,
                `Error fetching resources: ${resourceError.message}`
              );
            });
        });
      })
      .catch((error) => {
        bot.sendMessage(chatId, `Error fetching profile: ${error.message}`);
      });
  } else {
    bot.sendMessage(chatId, "You need to log in first!");
  }
}

module.exports = { sendResourcesMessage };
