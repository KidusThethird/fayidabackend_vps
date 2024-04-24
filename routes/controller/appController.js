const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
//send mail from testing account
const signup = async (req, res) => {
  let testAccount = await nodemailer.createTestAccount();

  let transpoerter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });

  let message = {
    from: '"Fred Foo"<foo@example.com>',
    to: "bar@example.com, baz@example.com",
    subject: "Hello from subject",
    text: "Hello world",
    html: "<b>Hello World?</b>",
  };

  transpoerter
    .sendMail(message)
    .then((info) => {
      return res.status(201).json({
        msg: "You should recive an email",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });

  //res.status(201).json("Signup Successfully");
};

//send mail from gmail account
const getbill = (req, res) => {
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
      name: "Daily Tuition3",
      intro: "your bill has arrived!",
      table: {
        data: [
          {
            item: "Nodemailer Stack Book",
            description: "A Backend applicaation",
            price: "$10.99",
          },
        ],
      },
      outro: "Looking forward to do more business.",
    },
  };

  let mail = MailGenerator.generate(response);
  let message = {
    from: "acadamy@gmail.com",
    to: "kidus.z3rd@gmail.com",
    subject: "Place Order",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        msg: "You should receive an email",
      });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
  //res.status(201).json("getBill successfully");
};

module.exports = {
  signup,
  getbill,
};
