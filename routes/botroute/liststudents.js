const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { localUrl } = require("../../configFIles");
const { getUserLanguage } = require("./languages"); // Import the function to get user's language preference

module.exports = {
  listStudentsfromAgents: (bot, chatId, userCookieJars) => {
    const cookieJar = userCookieJars.get(chatId);

    if (cookieJar) {
      const axiosInstance = wrapper(
        axios.create({
          jar: cookieJar,
          withCredentials: true,
        })
      );

      // Fetch agent profile before showing transactions
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
            bankaccountnumber,
          } = profileResponse.data;

          // Clear the chat first, then print profile information
          bot.sendMessage(chatId, "Clearing previous messages...").then(() => {
            bot.sendMessage(
              chatId,
              `Name: ${firstName} ${lastName} ${grandName}\n`
            );
            console.log("Mypromocode: " + promocode);
            // After showing profile, proceed to fetch students data

            axios
              .get(`${localUrl}/agents/studentswithpromocode/${promocode}`)
              .then((transactionResponse) => {
                const studentsData = transactionResponse.data; // Assuming this is an array of student data objects
                console.log("first");

                let studentsInfoMessage = "--- Students Info ---\n";

                if (studentsData && studentsData.length > 0) {
                  // Iterate over each student and extract the required fields
                  studentsData.forEach((student, index) => {
                    const { firstName, lastName, grandName, gread, age } =
                      student;

                    // Format the full name (firstName + lastName + grandName if grandName exists)
                    const fullName = `${firstName} ${lastName} ${
                      grandName || ""
                    }`.trim();

                    // Append each student's info to the message
                    studentsInfoMessage +=
                      `\nStudent ${index + 1}:\n` +
                      `Full Name: ${fullName}\n` +
                      `Grade: ${gread}\n` +
                      `Age: ${age}\n`;
                  });

                  // Send the formatted message to the user
                  bot.sendMessage(chatId, studentsInfoMessage);
                } else {
                  bot.sendMessage(chatId, "No students found.");
                }

                // Get the user's language preference for the button text
                const language = getUserLanguage(chatId);
                const mainMenuText = language === "am" ? "መነሻ" : "Main Menu"; // Define button text based on language

                // Send a Back to Menu button
                bot.sendMessage(chatId, "Choose an option:", {
                  reply_markup: {
                    inline_keyboard: [
                      [
                        {
                          text: mainMenuText,
                          callback_data: "agent_main_menu",
                        },
                      ],
                    ],
                  },
                });
              })
              .catch((transactionError) => {
                bot.sendMessage(
                  chatId,
                  "An error occurred while fetching students data: " +
                    transactionError.message
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
