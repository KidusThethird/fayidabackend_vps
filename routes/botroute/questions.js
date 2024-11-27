const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { localUrl } = require("../../configFIles");
const languages = require("./languages"); 
const tokenStore = require("./tokenInfo"); 

// Import the languages module
module.exports = {
  fetchQuestionsForGrade: (bot, chatId, userCookieJars) => {
   // const token = userTokens.get(chatId);
console.log("Hello from question")

//console.log("Shared: "+ token)

const token = tokenStore.getToken(chatId);

    console.log("questions is started " + token)
   // const cookieJar = userCookieJars.get(chatId);

    if (token) {
    
       
 console.log("there is a token :" + token)
      const axiosInstance = wrapper(
        axios.create({
          
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`, // Add the Bearer token in the headers
          },
        })
      );

      // Fetch user profile to get the Grade
      axiosInstance
        .get(`${localUrl}/newlogin/profile` , {
         
        })
        .then((profileResponse) => {
          const {
            firstName,
            lastName,
            id: userId,
            gread,
          } = profileResponse.data; // Added userId

          // Get the user's language preference

          console.log("We are here 2")
        //  console.log("log: "+JSON.stringify(profileResponse))
          console.log("not here")
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
              backToMainMenu: "Back to Main Menu",
            },
            am: {
              fetchingGrade: "እባኮትን የእርስዎን ደረጃ ይፈትሹ...",
              name: `ስም: ${firstName} ${lastName}\nደረጃ: ${gread}`,
              currentQuestion: `ወቅታዊ ጥያቄ ለደረጃ ${gread}:\n`,
              typeResponse: "መልስዎን ይዘሉ እና ይላኩ።",
              noActiveQuestion: "አሁን የሚኖር ጥያቄ የለም።",
              noQuestions: "አሁን ለመደገፍ ጥያቄ የለም!",
              profileError: "የእርስዎ መግቢያ ማዕከል መፈለጊያ ጊዜ የተከሰተ ነው: ",
              submitSuccess: "መልስዎ በተሳካ ሁኔታ ተልኳል!",
              submitError: "መልስዎ በማዘዋወር ወይም ተደጋጋሚ ለመላክ አይችሉም።",
              loginRequired: "መጀመሪያ ይግባኝ ነው!",
              backToMainMenu: "ወደ ዋና ሜኑ ተመለስ",
            },
          };

          // Define the "Back to Main Menu" button
          const mainMenuButton = {
            reply_markup: {
              inline_keyboard: [
                [
                  {
                    text: messages[language].backToMainMenu,
                    callback_data: "student_main_menu",
                  },
                ],
              ],
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
                      reply_markup: mainMenuButton.reply_markup,
                    });
                  } else {
                    // If there's no image, just send the message with footer
                    message += messages[language].typeResponse;
                    bot.sendMessage(chatId, message, mainMenuButton);
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
                            messages[language].submitSuccess,
                          mainMenuButton
                        );
                      })
                      .catch((error) => {
                        console.log("error catched: "+error)
                        bot.sendMessage(
                          chatId,
                          messages[language].submitError,
                          mainMenuButton
                        );
                      });

                    // Optionally, you may want to remove the listener after the response is received
                    bot.removeListener("message", this);
                  });
                } else {
                  // Send "no active question" message with the "Back to Main Menu" button
                  bot.sendMessage(
                    chatId,
                    messages[language].noActiveQuestion,
                    mainMenuButton
                  );
                }
              })
              .catch((questionsError) => {
                bot.sendMessage(
                  chatId,
                  messages[language].noQuestions,
                  mainMenuButton
                );
              });
          });
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            messages[language].profileError + error.message,
            mainMenuButton
          );
        });
    } else if (!token) {
      bot.sendMessage(chatId, "You need to log in first!");
      return;
    } else {
      bot.sendMessage(chatId, messages[language].loginRequired, mainMenuButton);
    }
  },
};
