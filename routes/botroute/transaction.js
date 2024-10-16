const { CookieJar } = require("tough-cookie");
const { wrapper } = require("axios-cookiejar-support");
const axios = require("axios");
const { localUrl } = require("../../configFIles");

module.exports = {
  fetchAgentTransactions: (bot, chatId, userCookieJars) => {
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
            // After showing profile, proceed to fetch transactions

            axios
              .get(`${localUrl}/agenttransaction/withpromocode/${promocode}`)
              .then((transactionResponse) => {
                const transactions = transactionResponse.data;
                console.log("first");

                if (transactions && transactions.length > 0) {
                  let transactionList = "--- Transactions ---\n";
                  transactions.forEach((transaction, index) => {
                    transactionList +=
                      `Transaction ${index + 1}:\n` +
                      `Value: ${transaction.value}\n` +
                      `Date: ${new Date(
                        transaction.createdAt
                      ).toLocaleString()}\n\n`;
                  });

                  bot.sendMessage(chatId, transactionList);
                } else {
                  bot.sendMessage(chatId, "No transactions found.");
                }
              })
              .catch((transactionError) => {
                bot.sendMessage(
                  chatId,
                  "An error occurred while fetching transactions: " +
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
