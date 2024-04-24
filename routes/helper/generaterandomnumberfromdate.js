function generateUniqueRandomNumber() {
  const now = new Date(); // Get the current date and time
  const year = now.getFullYear().toString().slice(-2); // Extract the last two digits of the year
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Extract the month and pad with leading zero if necessary
  const day = now.getDate().toString().padStart(2, "0"); // Extract the day and pad with leading zero if necessary
  const hour = now.getHours().toString().padStart(2, "0"); // Extract the hour and pad with leading zero if necessary
  const minute = now.getMinutes().toString().padStart(2, "0"); // Extract the minute and pad with leading zero if necessary
  const second = now.getSeconds().toString().padStart(2, "0"); // Extract the second and pad with leading zero if necessary

  const uniqueRandomNumber = parseInt(
    `${day}${month}${year}${hour}${minute}${second}`
  );

  return uniqueRandomNumber;
}

// Example usage
const uniqueRandomNumber = generateUniqueRandomNumber();
console.log(uniqueRandomNumber);
module.exports = generateUniqueRandomNumber;
