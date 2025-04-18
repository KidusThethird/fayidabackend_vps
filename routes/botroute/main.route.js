const express = require("express");
const telegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { sendWelcomeMessage } = require("./welcomeRoute");
const { sendPostLoginOptions } = require("./choices02");
//sendClubOptions
const { sendClubOptions } = require("./clubs");

const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const { sendAgentOptions } = require("./agentChoices");

const { editFirstName } = require("./edit_agent/editFirstName");
const { editLastName } = require("./edit_agent/editLastName");
const { editGrandName } = require("./edit_agent/editGrandName");
const { editBankAccountType } = require("./edit_agent/editBankAccountType");
const { editBankAccountNumber } = require("./edit_agent/editAccountNumber");
const { editPhoneNumber } = require("./edit_agent/editPhoneNumber");
const { sendResourcesMessage } = require("./resources");
const { sendSubjectOptions } = require("./club02");
const {
  handleAgentLogin,
  viewAgentProfile,
  editProfile,
  showAgentMenu,
} = require("./agentLogin");
const { localUrl } = require("../../configFIles");
const { fetchAgentTransactions } = require("./transaction");
const { listStudentsfromAgents } = require("./liststudents");
const { fetchQuestionsForGrade } = require("./questions");
const { postComment } = require("./comment");
const { postAgentComment } = require("./agent_commnet");

const languages = require("./languages");
const agentLanguages = require("./agent_language");
const { sendBotInfo } = require("./get_info");
const tokenStore = require("./tokenInfo"); 
//const sendWelcomeMessage = require("./welcomeRoute");
//sendWelcomeMessage
const router = express.Router();

// Access the Telegram token from environment variables
const TELEGRAMTOKEN = process.env.TELEGRAM_TOKEN;
const bot = new telegramBot(TELEGRAMTOKEN, { polling: true });

// Create a Map to store cookie jars for each user
const userCookieJars = new Map();

const userTokens = new Map();


router.get("/fetchtoken", (req, res, next) => {
  req.sharedData = "This is shared data from Router 1"; // Attach the variable to `req`
  next(); // Pass control to the next middleware or router
});

// Handle incoming messages
bot.on("message", (message) => {
  const chatId = message.from.id;
  const userName = message.from.first_name;
  console.log("Message: " + message.text);
  console.log("Message Id: " + chatId);

  // Handle '/start' command and call the welcome route
  if (message.text === "/start") {
    sendWelcomeMessage(bot, chatId, userName);
  }
});

// Handle callback queries from inline keyboard
bot.on("callback_query", (callbackQuery) => {
  const chatId = callbackQuery.from.id;
  const callbackData = callbackQuery.data;

  
if (callbackData === "login_student") {
  // Ask for email
  bot.sendMessage(chatId, "Please enter your email:");

  // Listen for the next message (email)
  bot.once("message", (emailMessage) => {
    const email = emailMessage.text.trim();
    bot.sendMessage(chatId, "Please enter your password:");

    // Listen for the next message (password)
    bot.once("message", (passwordMessage) => {
      const password = passwordMessage.text.trim();

      // Send a request to the login endpoint
      axios
        .post(`${localUrl}/newlogin/login`, {
          email,
          password,
        })
        .then((response) => {
          if (response.data.accessToken) {
            // Save the token with the user's chatId
            const token = response.data.accessToken;
            tokenStore.setToken(chatId, token);
            userTokens.set(chatId, token);

            bot.sendMessage(chatId, "Login successful! 🎉");
            sendPostLoginOptions(bot, chatId); // Show post-login options
          } else {
            bot.sendMessage(chatId, "Login failed: Invalid credentials.");
          }
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            "Log in failed. Please check your credentials and try again. ",
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Try Again",
                      callback_data: "log_out_page", // Retry login
                    },
                  ],
                ],
              },
            }
          );
        });
    });
  });
}//change_language_agent
  else if (callbackData === "change_language") {
    languages.sendLanguageOptions(bot, chatId, "student");
  } else if (callbackData === "change_language_agent") {
    languages.sendLanguageOptions(bot, chatId, "agent");
  } else if (callbackData === "change_language_home") {
    languages.sendLanguageOptions(bot, chatId, "home");
  } else if (callbackData.startsWith("lang_")) {
    const language = callbackData.split("_")[1];

    // Set the language preference using setLanguage in languages.js
    languages.setLanguage(bot, chatId, language);
  }
  if (callbackData === "resources") {
    sendResourcesMessage(bot, chatId, userCookieJars); // Call the function from resources.js
  }
  //sendWelcomeMessage
  if (callbackData === "log_out_page") {
    //sendWelcomeMessage();
    // const chatId = message.from.id;
    // const userName = message.from.first_name;
    console.log("This is something to print");
    console.log("CHat Id : ");
    console.log("UserName: ");
    sendWelcomeMessage(bot, chatId, ""); // Call the function from resources.js
  }
  if (callbackData === "get_info") {
    sendBotInfo(bot, chatId); // Call the function to send the info message
  } else if (callbackData === "questions") {
    fetchQuestionsForGrade(bot, chatId, userCookieJars);
    // Fetch questions for the user
  }

  //postAgentComment
  else if (callbackData === "agnet_comment") {
    const language = languages.getUserLanguage(chatId);

    const messages = {
      en: {
        prompt: "Please type your comment:",
      },
      am: {
        prompt: "እባኮትን መልዕትዎን ያስገቡ እና ይላኩ",
      },
    };

    const promptMessage = messages[language].prompt;
    // Ask the user to type a comment
    bot.sendMessage(chatId, promptMessage);

    // Listen for the next message (the comment text)
    bot.once("message", (commentMessage) => {
      const commentText = commentMessage.text;

      // Call the function to post the comment, passing the bot instance
      postAgentComment(bot, chatId, commentText);
    });
  } else if (callbackData === "comment") {
    const language = languages.getUserLanguage(chatId);

    const messages = {
      en: {
        prompt: "Please type your comment:",
      },
      am: {
        prompt: "እባኮትን መልዕትዎን ያስገቡ እና ይላኩ",
      },
    };

    const promptMessage = messages[language].prompt;
    // Ask the user to type a comment
    bot.sendMessage(chatId, promptMessage);

    // Listen for the next message (the comment text)
    bot.once("message", (commentMessage) => {
      const commentText = commentMessage.text;

      // Call the function to post the comment, passing the bot instance
      postComment(bot, chatId, commentText);
    });
  } else if (callbackData === "transaction") {
    const cookieJar = userCookieJars.get(chatId);
    fetchAgentTransactions(bot, chatId, userCookieJars); // Correctly call this function
  } else if (callbackData === "list_students") {
    const cookieJar = userCookieJars.get(chatId);
    listStudentsfromAgents(bot, chatId, userCookieJars); // Correctly call this function
  } else if (callbackData === "login_agent") {
    sendAgentOptions(bot, chatId); // Show "Login" and "Sign Up" options for agents
  } else if (callbackData === "login_agent_choice") {
    // When "Login" under agent options is pressed
    handleAgentLogin(bot, chatId, userCookieJars); // Call agent login logic (email, password)
  } else if (callbackData === "view_profile_agent") {
    viewAgentProfile(bot, chatId, userCookieJars); // Show agent profile
  }

  if (callbackData === "student_main_menu") {
    // Call sendPostLoginOptions from choice02.js
    sendPostLoginOptions(bot, chatId);
  }

  if (callbackData === "agent_main_menu") {
    // Call sendPostLoginOptions from choice02.js
    showAgentMenu(bot, chatId);
  } 
  
  
  
  else if (callbackData === "view_profile") {
    // Retrieve the token for the user
    const token = userTokens.get(chatId); // Replace with your token storage mechanism
  
    if (token) {
      // Set up Axios with Bearer token
      const axiosInstance = axios.create({
        headers: {
          Authorization: `Bearer ${token}`, // Send token in the Authorization header
        },
      });
  
      // Fetch user profile
      axiosInstance
        .get(`${localUrl}/newlogin/profile`)
        .then((profileResponse) => {
          // Check if the response includes an "id" attribute
          if (profileResponse.data.id) {
            const { firstName, lastName, gread } = profileResponse.data;
            const fullName = `${firstName} ${lastName}`;
  
            // Prepare the message and the inline keyboard
            const profileMessage = `Profile Information:\nName: ${fullName}\nGrade: ${gread}`;
  
            const language = languages.getUserLanguage(chatId);
  
            const messages = {
              en: {
                prompt: "Back To Main Menu:",
              },
              am: {
                prompt: "ወደ ዋናው ምርጫ",
              },
            };
  
            // Create an inline keyboard with a button leading to "main_menu"
            const options = {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: `${messages[language].prompt}`,
                      callback_data: "student_main_menu", // Callback data for the button
                    },
                  ],
                ],
              },
            };
  
            // Send the profile information with the button
            bot.sendMessage(chatId, profileMessage, options);
          } else {
            // If "id" is missing in the response, prompt user to log in
            bot.sendMessage(chatId, "You need to log in first!");
          }
        })
        .catch((error) => {
          bot.sendMessage(
            chatId,
            "An error occurred while fetching profile: " + error.message
          );
        });
    } else {
      // If no token is found for the user
      bot.sendMessage(chatId, "You need to log in first!");
    }
  }
  
  
  
  
  
  else if (callbackData === "edit_profile") {
    editProfile(bot, chatId); // Call editProfile method to display editing options
  } else if (callbackData === "edit_first_name") {
    editFirstName(bot, chatId, userCookieJars); // Call the function to edit the first name
  } else if (callbackData === "edit_last_name") {
    editLastName(bot, chatId, userCookieJars); // Call the function to edit the first name
  } else if (callbackData === "edit_grand_name") {
    editGrandName(bot, chatId, userCookieJars); // Call the function to edit the first name
  } else if (callbackData === "edit_bank_account_type") {
    editBankAccountType(bot, chatId, userCookieJars); // Call the function to edit the first name
  } else if (callbackData === "edit_bank_account_number") {
    editBankAccountNumber(bot, chatId, userCookieJars); // Call the function to edit the first name
  } else if (callbackData === "edit_phone_number") {
    editPhoneNumber(bot, chatId, userCookieJars); // Call the function to edit the first name
  } else if (callbackData === "clubs") {
    sendClubOptions(bot, chatId); // Show club options when 'Clubs' is selected
  }

  /////////////////////////////////////

  //////////////////////////////

  if (callbackData === "grade_9_club") {
    sendSubjectOptions(bot, chatId, "grade9");
  } else if (callbackData === "grade_10_club") {
    sendSubjectOptions(bot, chatId, "grade10");
  } else if (callbackData === "grade_11_club") {
    sendSubjectOptions(bot, chatId, "grade11");
  } else if (callbackData === "grade_12_club") {
    sendSubjectOptions(bot, chatId, "grade12");
  }

  //  else if (callbackData === "grade_9_club") {
  //   bot.sendMessage(chatId, "Go to Grade 9 Club...", {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: "Go to Grade 9 Club",
  //             url: "https://t.me/fayidaacademy_grade9_club", // Link to the Grade 9 Club
  //           },
  //         ],
  //       ],
  //     },
  //   });
  // } else if (callbackData === "grade_10_club") {
  //   bot.sendMessage(chatId, "Go to Grade 10 Club...", {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: "Go to Grade 10 Club",
  //             url: "https://t.me/fayidaacademy_grade10_club", // Link to the Grade 10 Club
  //           },
  //         ],
  //       ],
  //     },
  //   });
  // } else if (callbackData === "grade_11_club") {
  //   bot.sendMessage(chatId, "Go to Grade 11 Club...", {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: "Go to Grade 11 Club",
  //             url: "https://t.me/fayidaacademy_grade11_club", // Link to the Grade 11 Club
  //           },
  //         ],
  //       ],
  //     },
  //   });
  // } else if (callbackData === "grade_12_club") {
  //   bot.sendMessage(chatId, "Go to Grade 12 Club...", {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: "Go to Grade 12 Club",
  //             url: "https://t.me/fayidaacademy_grade12_club", // Link to the Grade 12 Club
  //           },
  //         ],
  //       ],
  //     },
  //   });
  // } else if (callbackData === "others_club") {
  //   bot.sendMessage(chatId, "You clicked Others.");
  // }
  else if (callbackData === "questions") {
    bot.sendMessage(chatId, "You clicked Questions.");
  } else if (callbackData === "go_to_website") {
    // Redirect to the website

    const language = languages.getUserLanguage(chatId);

    const messages = {
      en: {
        prompt: "Back To Main Menu:",
      },
      am: {
        prompt: "ወደ ዋናው ምርጫ",
      },
    };
    bot.sendMessage(chatId, "Redirecting you to the website...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Visit Website",
              url: "https://www.fayidaacademy.com", // Website URL
            },
          ],
          [
            {
              text: `${messages[language].prompt}`, // Button to call back to student_main_menu
              callback_data: "student_main_menu", // Callback data for the button
            },
          ],
        ],
      },
    });
  } else if (callbackData === "change_language") {
    bot.sendMessage(chatId, "");
  } else if (callbackData === "sign_up_student") {
    // Redirect to the signup webpage
    bot.sendMessage(chatId, "Redirecting you to the signup page...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Go to Signup Page",
              url: "https://www.fayidaacademy.com/signup", // Signup URL
            },
          ],
        ],
      },
    });
  }

  // Acknowledge the callback query to remove the loading state
  bot.answerCallbackQuery(callbackQuery.id);
});
const good= "good"
module.exports = {router};
