const express = require("express");
const telegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { sendWelcomeMessage } = require("./welcomeRoute");
const { sendPostLoginOptions, sendClubOptions } = require("./choices02");
const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const { sendAgentOptions } = require("./agentChoices");

const { editFirstName } = require("./edit_agent/editFirstName");
const { editLastName } = require("./edit_agent/editLastName");
const { editGrandName } = require("./edit_agent/editGrandName");
const { editBankAccountType } = require("./edit_agent/editBankAccountType");
const { editBankAccountNumber } = require("./edit_agent/editAccountNumber");
const { editPhoneNumber } = require("./edit_agent/editPhoneNumber");

const {
  handleAgentLogin,
  viewAgentProfile,
  editProfile,
} = require("./agentLogin");
const { localUrl } = require("../../configFIles");
const { fetchAgentTransactions } = require("./transaction");
const { listStudentsfromAgents } = require("./liststudents");
const { fetchQuestionsForGrade } = require("./questions");
const { postComment } = require("./comment");
const languages = require("./languages");
const agentLanguages = require("./agent_language");

const router = express.Router();

// Access the Telegram token from environment variables
const TELEGRAMTOKEN = process.env.TELEGRAM_TOKEN;
const bot = new telegramBot(TELEGRAMTOKEN, { polling: true });

// Create a Map to store cookie jars for each user
const userCookieJars = new Map();

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
      const email = emailMessage.text;
      bot.sendMessage(chatId, "Please enter your password:");

      // Listen for the next message (password)
      bot.once("message", (passwordMessage) => {
        const password = passwordMessage.text;

        // Create a new cookie jar for the user
        const cookieJar = new CookieJar();
        userCookieJars.set(chatId, cookieJar);
        const axiosInstance = wrapper(
          axios.create({
            jar: cookieJar, // Use the user's cookie jar
            withCredentials: true,
          })
        );

        // Send a request to the login endpoint
        axiosInstance
          .post(`${localUrl}/login_register/loginss`, {
            email,
            password,
          })
          .then((response) => {
            if (response.data.message === "Login successful") {
              bot.sendMessage(chatId, "Login successful! 🎉");
              sendPostLoginOptions(bot, chatId); // Show post-login options
            } else {
              bot.sendMessage(chatId, "Login failed: " + response.data.message);
            }
          })
          .catch((error) => {
            bot.sendMessage(
              chatId,
              "An error occurred during login: " + error.message
            );
          });
      });
    });
  } //change_language_agent
  else if (callbackData === "change_language") {
    languages.sendLanguageOptions(bot, chatId, "student");
  } else if (callbackData === "change_language_agent") {
    languages.sendLanguageOptions(bot, chatId, "agent");
  } else if (callbackData.startsWith("lang_")) {
    const language = callbackData.split("_")[1];

    // Set the language preference using setLanguage in languages.js
    languages.setLanguage(bot, chatId, language);
  } else if (callbackData === "questions") {
    fetchQuestionsForGrade(bot, chatId, userCookieJars);
    // Fetch questions for the user
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
  } else if (callbackData === "view_profile") {
    // Handle 'View Profile' option
    const cookieJar = userCookieJars.get(chatId);
    if (cookieJar) {
      const axiosInstance = wrapper(
        axios.create({
          jar: cookieJar,
          withCredentials: true,
        })
      );

      // Fetch user profile
      axiosInstance
        .get(`${localUrl}/login_register/profile`)
        .then((profileResponse) => {
          const { firstName, lastName, gread } = profileResponse.data;
          const fullName = `${firstName} ${lastName}`;
          bot.sendMessage(
            chatId,
            `Profile Information:\nName: ${fullName}\nGrade: ${gread}`
          );
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
  } else if (callbackData === "edit_profile") {
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
  } else if (callbackData === "grade_9_club") {
    bot.sendMessage(chatId, "Go to Grade 9 Club...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Go to Grade 9 Club",
              url: "https://t.me/fayidaacademy_grade9_club", // Link to the Grade 9 Club
            },
          ],
        ],
      },
    });
  } else if (callbackData === "grade_10_club") {
    bot.sendMessage(chatId, "Go to Grade 10 Club...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Go to Grade 10 Club",
              url: "https://t.me/fayidaacademy_grade10_club", // Link to the Grade 10 Club
            },
          ],
        ],
      },
    });
  } else if (callbackData === "grade_11_club") {
    bot.sendMessage(chatId, "Go to Grade 11 Club...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Go to Grade 11 Club",
              url: "https://t.me/fayidaacademy_grade11_club", // Link to the Grade 11 Club
            },
          ],
        ],
      },
    });
  } else if (callbackData === "grade_12_club") {
    bot.sendMessage(chatId, "Go to Grade 12 Club...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Go to Grade 12 Club",
              url: "https://t.me/fayidaacademy_grade12_club", // Link to the Grade 12 Club
            },
          ],
        ],
      },
    });
  } else if (callbackData === "others_club") {
    bot.sendMessage(chatId, "You clicked Others.");
  } else if (callbackData === "questions") {
    bot.sendMessage(chatId, "You clicked Questions.");
  } else if (callbackData === "go_to_website") {
    // Redirect to the website
    bot.sendMessage(chatId, "Redirecting you to the website...", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Visit Website",
              url: "https://www.fayidaacademy.com", // Website URL
            },
          ],
        ],
      },
    });
  } else if (callbackData === "change_language") {
    bot.sendMessage(chatId, "You clicked Change Language.");
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

module.exports = router;
