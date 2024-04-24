const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");

exports.emailsender = (userEmail, userName, subject, intro, outro) => {
  const sendCustomEmail = () => {
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
        link: "https://fayidaacadamy.com",
      },
    });

    let response = {
      body: {
        name: userName,
        intro: intro,

        outro: outro,
      },
    };

    let mail = MailGenerator.generate(response);
    let message = {
      from: "acadamy.fayida@gmail.com",
      to: `${userEmail}`,
      subject: subject,
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

  sendCustomEmail();
  return "working";
};
