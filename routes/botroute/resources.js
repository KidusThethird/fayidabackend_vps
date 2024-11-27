const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { localUrl } = require("../../configFIles");
const languages = require("./languages"); // Import languages module
const tokenStore = require("./tokenInfo"); 


function sendResourcesMessage(bot, chatId, userCookieJars) {
 // const cookieJar = userCookieJars.get(chatId);
 const token = tokenStore.getToken(chatId);
 console.log("token from rs: " + token)
  if (token) {
    const axiosInstance = wrapper(
      axios.create({
        headers: {
          Authorization: `Bearer ${token}`, // Add the Bearer token in the headers
        },
        withCredentials: true,
      })
    );

    // Fetch the user's profile
    axiosInstance
      .get(`${localUrl}/newlogin/profile`)
      .then((profileResponse) => {
        const { firstName, lastName, gread } = profileResponse.data;
        const language = languages.getUserLanguage(chatId);

        const messages = {
          en: {
            greeting: "Your files are ready:",
            profileInfo: `Profile Information:\nName: ${firstName} ${lastName}\nGrade: ${gread}`,
          },
          am: {
            greeting: "ዶክመንቶቹ እንደሚከተለው ናቸው፥",
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

              // After all documents are sent, add a back to main menu button
              bot.sendMessage(chatId, "Here are your resources:", {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "Back to Main Menu", // Button text in English and Amharic
                        callback_data: "student_main_menu", // Callback data for the button
                      },
                    ],
                  ],
                },
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
