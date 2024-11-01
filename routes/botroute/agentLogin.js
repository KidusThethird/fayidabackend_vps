const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { sendEditProfileOptions } = require("./editProfileOptions");
const { localUrl } = require("../../configFIles");
const { getUserLanguage, setUserLanguage } = require("../botroute/languages"); // Import the language functions

module.exports = {
  handleAgentLogin: (bot, chatId, userCookieJars) => {
    // Ask for email
    bot.sendMessage(chatId, "Please enter your email:");

    bot.once("message", (emailMessage) => {
      const email = emailMessage.text;
      bot.sendMessage(chatId, "Please enter your password:");

      bot.once("message", (passwordMessage) => {
        const password = passwordMessage.text;

        // Create a new cookie jar for the agent
        const cookieJar = new CookieJar();
        userCookieJars.set(chatId, cookieJar);
        const axiosInstance = wrapper(
          axios.create({
            jar: cookieJar,
            withCredentials: true,
          })
        );

        // Send a login request to the API (same as student login)
        axiosInstance
          .post(`${localUrl}/login_register/agentlogin`, {
            email,
            password,
          })
          .then((response) => {
            if (response.data.message === "Login successful") {
              bot.sendMessage(chatId, "Login successful! 🎉");
              module.exports.showAgentMenu(bot, chatId); // Call the method to show the menu
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
  },

  viewAgentProfile: (bot, chatId, userCookieJars) => {
    const cookieJar = userCookieJars.get(chatId);
    if (cookieJar) {
      const axiosInstance = wrapper(
        axios.create({
          jar: cookieJar,
          withCredentials: true,
        })
      );

      // Fetch agent profile
      axiosInstance
        .get(`${localUrl}/login_register/profile`)
        .then((profileResponse) => {
          const {
            firstName,
            lastName,
            grandName,
            email,
            phoneNumber,
            prefferdLanguage,
            promocode,
            balance,
            bankaccounttype,
            backaccountnumber,
          } = profileResponse.data;
          const fullName = `${firstName} ${lastName} ${grandName}`;
          bot.sendMessage(
            chatId,
            `Profile Information:\nName: ${fullName}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nPromo Code: ${promocode}\nCurrent Balance: ${balance}\nAccount Type: ${bankaccounttype}\nAccount Number: ${backaccountnumber}`,
            {
              reply_markup: {
                inline_keyboard: [
                  [
                    {
                      text: "Back to Main Menu",
                      callback_data: "agent_main_menu", // New button callback
                    },
                  ],
                ],
              },
            }
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
  },

  editProfile: (bot, chatId) => {
    sendEditProfileOptions(bot, chatId); // Call the function to send edit options
  },

  // Method to show the agent menu options
  showAgentMenu: (bot, chatId) => {
    const language = getUserLanguage(chatId); // Get the user's language preference

    // Define the text for both English and Amharic
    const options = {
      en: {
        viewProfile: "View Profile",
        editProfile: "Edit Profile",
        listStudents: "List Students",
        transactions: "Transactions",
        comment: "Comment",
        changeLanguage: "Change Language",
        log_out: "Log Out",
      },
      am: {
        viewProfile: "ፕሮፌል ይመልከቱ",
        editProfile: "ፕሮፌል ይቀይሩ",
        listStudents: "ተማሪዎችን ዝርዝር",
        transactions: "ግብይት",
        comment: "አስተያየት",
        changeLanguage: "ቋንቋ ይለውጡ",
        log_out: "ወደ ዋናው መውጫ",
      },
    };

    bot.sendMessage(chatId, "What would you like to do next?", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: options[language].viewProfile,
              callback_data: "view_profile_agent",
            },
          ],
          [
            {
              text: options[language].editProfile,
              callback_data: "edit_profile",
            },
          ],
          [
            {
              text: options[language].listStudents,
              callback_data: "list_students",
            },
          ],
          [
            {
              text: options[language].transactions,
              callback_data: "transaction",
            },
          ],
          [
            {
              text: options[language].comment,
              callback_data: "agnet_comment",
            },
          ],
          [
            {
              text: options[language].changeLanguage,
              callback_data: "change_language_agent",
            },
          ],
          [
            {
              text: options[language].log_out,
              callback_data: "log_out_page",
            },
          ],
        ],
      },
    });
  },
};
