exports.codeGeneratorFunction = () => {
  //const randomNum = Math.floor(Math.random() * 9000) + 1000; // Generate a random number between 1000 and 9999

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const randomNumber = Math.floor(Math.random() * 9000) + 1000;
  const randomLetter = letters[Math.floor(Math.random() * letters.length)];

  // Convert the random number to a string
  const randomNumberString = randomNumber.toString();

  // Generate a random index to insert the letter
  const randomIndex = Math.floor(
    Math.random() * (randomNumberString.length + 1)
  );

  // Insert the random letter at the random index
  const randomCode =
    randomNumberString.slice(0, randomIndex) +
    randomLetter +
    randomNumberString.slice(randomIndex);

  return randomCode;
};
