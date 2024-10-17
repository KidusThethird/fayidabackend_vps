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
          const {
            firstName,
            lastName,
            id: userId,
            gread,
          } = profileResponse.data; // Added userId

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
                const {
                  text,
                  image,
                  imgUrl,
                  id: questionId,
                } = questionsResponse.data; // Added questionId

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
                      .post(
                        "http://localhost:5000/botquestions/answers",
                        responseData
                      )
                      .then((response) => {
                        // Send success message from the server's response
                        bot.sendMessage(
                          chatId,
                          response.data.message ||
                            "Your answer has been submitted successfully!"
                        );
                      })
                      .catch((error) => {
                        bot.sendMessage(
                          chatId,
                          "You can not submit the answer if you are too late or if you are trying to submit multiple times. "
                          //error.message
                        );
                      });

                    // Optionally, you may want to remove the listener after the response is received
                    bot.removeListener("message", this);
                  });
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
