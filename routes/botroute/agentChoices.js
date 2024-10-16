// agentChoices.js
module.exports = {
  sendAgentOptions: (bot, chatId) => {
    const options = {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Login", callback_data: "login_agent_choice" }],
          [
            {
              text: "Sign Up",
              url: "https://www.fayidaacademy.com/agent_login", // Redirect to sign-up page
            },
          ],
        ],
      },
    };

    // Send the message with login and sign-up options
    bot.sendMessage(chatId, "Please choose an option:", options);
  },
};
