const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { sendEditProfileOptions } = require("./editProfileOptions"); // Import the edit profile options

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
            jar: cookieJar, // Use the agent's cookie jar
            withCredentials: true,
          })
        );

        // Send a login request to the API (same as student login)
        axiosInstance
          .post("http://localhost:5000/login_register/agentlogin", {
            email,
            password,
          })
          .then((response) => {
            if (response.data.message === "Login successful") {
              bot.sendMessage(chatId, "Login successful! 🎉");

              // Show profile options including Edit Profile
              bot.sendMessage(chatId, "What would you like to do next?", {
                reply_markup: {
                  inline_keyboard: [
                    [
                      {
                        text: "View Profile",
                        callback_data: "view_profile_agent",
                      },
                      {
                        text: "Edit Profile",
                        callback_data: "edit_profile",
                      },
                      {
                        text: "List Students",
                        callback_data: "list_students",
                      },
                      {
                        text: "Transactions",
                        callback_data: "transactions",
                      },
                    ],
                  ],
                },
              });
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

      // Fetch agent profile (same as student)
      axiosInstance
        .get("http://localhost:5000/login_register/profile")
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
            `Profile Information:\nName: ${fullName}\nEmail: ${email}\nPhone Number: ${phoneNumber}\nPromo Code: ${promocode}\nCurrent Balance: ${balance}\nAccount Type: ${bankaccounttype}\nAccount Number: ${backaccountnumber}`
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
};
