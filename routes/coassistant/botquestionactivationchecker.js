const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("../login_register.route");

const cron = require("node-cron");

//this will check every five minute
cron.schedule("*/5 * * * *", async () => {
  console.log("Checking if any questions should be deactivated...");

  try {
    // Fetch all BotQuestions
    const questions = await prisma.BotQuestions.findMany();

    // Loop through each question and check its active status
    for (const question of questions) {
      const { id, period, activeAt, status } = question;

      // If the question is already 'down', skip it
      if (status === "down") continue;

      // Calculate the difference between the current time and activeAt
      const currentTime = new Date();
      const activeTime = new Date(activeAt);
      const timeDifference = Math.abs(currentTime - activeTime) / (1000 * 60); // Difference in minutes

      // Calculate the remaining time until deactivation
      const remainingMinutes = period - timeDifference;

      if (remainingMinutes <= 0) {
        // If the time difference is larger than the period, deactivate the question
        const updatedQuestion = await prisma.BotQuestions.update({
          where: {
            id: id,
          },
          data: {
            status: "down",
          },
        });
        console.log(`Deactivated question with ID: ${updatedQuestion.id}`);
      } else {
        // Show how many minutes are left until deactivation
        console.log(
          `Question with ID: ${id} has ${remainingMinutes.toFixed(
            2
          )} minutes remaining until deactivation.`
        );
      }
    }
  } catch (error) {
    console.error("Error updating questions:", error);
  }

  console.log("Question status check completed.");
});
module.exports = router;
