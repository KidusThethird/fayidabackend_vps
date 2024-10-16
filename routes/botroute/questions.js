const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { localUrl } = require("../../configFIles");
const languages = require("./languages"); // Import the languages module

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
          const {
            firstName,
            lastName,
            id: userId,
            gread,
          } = profileResponse.data; // Added userId

          // Get the user's language preference
          const language = languages.getUserLanguage(chatId);

          // Define translation messages
          const messages = {
            en: {
              fetchingGrade: "Fetching your grade...",
              name: `Name: ${firstName} ${lastName}\nGrade: ${gread}`,
              currentQuestion: `Current question for Grade ${gread}:\n`,
              typeResponse: "Type your response and send.",
              noActiveQuestion: "There is no active question right now.",
              noQuestions: "No Available Question Right Now!",
              profileError: "An error occurred while fetching profile: ",
              submitSuccess: "Your answer has been submitted successfully!",
              submitError:
                "You cannot submit the answer if you are too late or if you are trying to submit multiple times.",
              loginRequired: "You need to log in first!",
            },
            am: {
              fetchingGrade: "እባኮትን የእርስዎን ደረጃ ይፈትሹ...",
              name: `ስም: ${firstName} ${lastName}\nደረጃ: ${gread}`,
              currentQuestion: `ወቅታዊ ጥያቄ ለደረጃ ${gread}:\n`,
              typeResponse: "መልስዎን ይዘሉ እና ይላኩ።",
              noActiveQuestion: "አሁን የሚኖር ጥያቄ የለም።",
              noQuestions: "አሁን ለመደገፍ ጥያቄ የለም!",
              profileError: "የእርስዎ መግቢያ ማዕከል መፈለጊያ ጊዜ የተከሰተ ነው: ",
              submitSuccess: "መልስዎ በተ成功 ይላኩልዎታል!",
              submitError: "ወንድ ይህ ውይይት ከታች ነው ወይም ከአሁኑ በተነሱ ይላኩልዎታል።",
              loginRequired: "መጀመሪያ ይግባኝ ነው!",
            },
          };

          // Clear previous messages and show profile information
          bot.sendMessage(chatId, messages[language].fetchingGrade).then(() => {
            bot.sendMessage(chatId, messages[language].name);

            // After fetching the profile, proceed to fetch questions based on the Grade
            axios
              .get(`${localUrl}/botquestions/filtergrade/${gread}`)
              .then((questionsResponse) => {
                const {
                  text,
                  image,
                  imgUrl,
                  id: questionId,
                } = questionsResponse.data; // Added questionId

                // Prepare header and message
                let message = `${messages[language].currentQuestion}`;

                if (text) {
                  message += `\n${text}\n\n`; // Separate question text

                  // Check if there is an image and include it
                  if (image) {
                    bot.sendPhoto(chatId, imgUrl, {
                      caption: message + messages[language].typeResponse,
                    });
                  } else {
                    // If there's no image, just send the message with footer
                    message += messages[language].typeResponse;
                    bot.sendMessage(chatId, message);
                  }

                  // Listen for user's response
                  bot.on("message", (msg) => {
                    const userResponse = msg.text; // The user's typed answer

                    // Prepare data to send to the answers endpoint
                    const responseData = {
                      text: userResponse,
                      userId: userId, // User ID from profile fetch
                      questionId: questionId, // Question ID from questions fetch
                    };

                    // Send the user's response to the server
                    axios
                      .post(`${localUrl}/botquestions/answers`, responseData)
                      .then((response) => {
                        // Send success message from the server's response
                        bot.sendMessage(
                          chatId,
                          response.data.message ||
                            messages[language].submitSuccess
                        );
                      })
                      .catch((error) => {
                        bot.sendMessage(chatId, messages[language].submitError);
                      });

                    // Optionally, you may want to remove the listener after the response is received
                    bot.removeListener("message", this);
                  });
                } else {
                  bot.sendMessage(chatId, messages[language].noActiveQuestion);
                }
              })
              .catch((questionsError) => {
                bot.sendMessage(chatId, messages[language].noQuestions);
              });
          });
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            messages[language].profileError + error.message
          );
        });
    } else {
      bot.sendMessage(chatId, messages[language].loginRequired);
    }
  },
};
