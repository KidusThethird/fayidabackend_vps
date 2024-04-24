const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.emailsender = (userEmail, userName, confirmationCode) => {
  const confirmationTOMail = () => {
    let config = {
      service: "gmail",
      auth: {
        user: "acadamy.fayida@gmail.com",
        pass: "vjdlylnprsoifbqx",
      },
    };
    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
      theme: "default",
      product: {
        name: "Fayida Acadamy",
        link: "https://fayida.com",
      },
    });

    let response = {
      body: {
        name: userName,
        intro: `Here is your code: ${confirmationCode}`,

        outro: "Do not share this code with anyone.",
      },
    };

    let mail = MailGenerator.generate(response);
    let message = {
      from: "acadamy.fayida@gmail.com",
      to: `${userEmail}`,
      subject: "Confirmation",
      html: mail,
    };

    transporter
      .sendMail(message)
      .then(() => {
        console.log("Email sent successfully");
      })
      .catch((error) => {
        console.log("Error sending email:", error);
      });
  };

  confirmationTOMail();
  return "working";
};
