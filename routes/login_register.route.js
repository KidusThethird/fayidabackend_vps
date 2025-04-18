const router = require("express").Router();
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
require("dotenv").config();

const prisma = new PrismaClient();

const bcrypt = require("bcrypt");

const passport = require("passport");
const initializePassport = require("../passport-config");

const confirmationSend = require("./helper/confirmationEmail");
const codeGenerator = require("./helper/codegenerator");
const authenticateToken = require("./authMiddleware");

// initializePassport(
//   passport,
//   async (email) => {
//     const student = await prisma.students.findUnique({
//       where: { email: email },
//     });
//     return student;
//   },

//   async (id) => {
//     const student = await prisma.students.findUnique({
//       where: { id: id },
//     });
//     return student;
//   }
// );

//working previously
// router.use(
//   cors({
//     origin: ["https://fayidaacademy.com", "https://admin.fayidaacademy.com"],
//   })
// );

router.use(
  cors({
    origin: ["https://fayidaacademy.com", "https://admin.fayidaacademy.com"],
    credentials: true, // Allow credentials (e.g., cookies) if needed
  })
);

//router.use(cors({ credentials: true, origin: true }));
// initializePassport(
//   passport,
//   async (email) => {
//     const user = await prisma.students.findUnique({ where: { email: email } });

//     // console.log(user);
//     return user;
//   },

//   async (id) => {
//     console.log("account confirmed from passport");
//     const user = await prisma.students.findUnique({ where: { id: id } });

//     return user;
//   }
// );

initializePassport(
  passport,
  async (providedEmail) => {
    console.log("This is printed: " + providedEmail);

    // First, try to find the user based on the provided email
    const user = await prisma.students.findUnique({
      where: { email: providedEmail },
    });

    // If the user is found and the email is not null
    if (user && user.email) {
      return user; // Return the user if the email is not null
    } else {
      // If the email is null, check the agent_email instead
      const agentUser = await prisma.students.findUnique({
        where: { agent_email: providedEmail },
      });
      console.log("Agent User: " + JSON.stringify(agentUser));

      return agentUser; // Return the agent user if found
    }
  },

  async (id) => {
    console.log("Account confirmed from passport");
    const user = await prisma.students.findUnique({ where: { id: id } });

    return user;
  }
);

const flash = require("express-flash");
const session = require("express-session");
const { homeWebUrl, adminUrl } = require("../configFIles");

async function getUsers() {
  const users = await prisma.students.findUnique({
    where: { id: "d8859bce-a44a-43bb-ac3a-316b16ad54c7" },
  });
  return users;
}

const users = getUsers();
async function printUsers() {
  const users = await getUsers();
  // console.log(users);
}

printUsers();
const secretKey = process.env.SESSION_SECRET;
console.log("Key: " + secretKey);
router.use(
  session({
    //secret: "secret",
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
    cookie: {
      name: "customCookieName",
      maxAge: 1000 * 60 * 60 * 24, // Session will expire after 1 day
    },
  })
);
router.use(flash());
router.use(
  cors({
    origin: [`${homeWebUrl}`, `${adminUrl}`],
    methods: "GET,POST",
    allowedHeaders: "Content-Type,Authorization",
  })
);
// router.use(
//   cors({
//     origin: `${adminUrl}`,
//     methods: "GET,POST",
//     allowedHeaders: "Content-Type,Authorization",
//   })
// );

router.use(passport.initialize());
router.use(passport.session());
//router.use(methodOverride("_method"));

//Get all student
// router.get("/", checkAuthenticated, async (req, res, next) => {
//   try {
//     const questions = await prisma.questions.findMany({});
//     res.json(questions);
//   } catch (error) {
//     next(error);
//   }
// });

router.post("/register", async (req, res, next) => {
  console.log("To Register...");
  console.log("Data: " + JSON.stringify(req.body));
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    const student = await prisma.students.create({
      // data: req.body,

      data: {
        ...req.body, // Spread the existing request body
        studentStatus: "active", // Add new field
      },
    });

    const addNotificationtoAdmin = await prisma.Notifications.create({
      data: {
        type: "1",

        //studentsId: req.user.id,
        addressedTo: "admin",
        notiHead: "New Student Account is Created!",
        notiFull: `${req.body.firstName} ${req.body.lastName} has created an account!`,
        status: "0",
      },
    });
    res.status(200).json({ message: "Account has been created!" });
    // console.log(req.body);
    //res.redirect("https://www.google.com");
    //successRedirect: `${homeWebUrl}`,
  } catch (error) {}
});

const generatePromoCode = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let promoCode = "";
  for (let i = 0; i < 8; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    promoCode += characters[randomIndex];
  }
  return promoCode;
};

router.post("/register_agent", async (req, res, next) => {
  console.log("We are here");
  try {
    req.body.password = await bcrypt.hash(req.body.password, 10);
    req.body = {
      ...req.body,
      accountType: "agent",
      promocode: generatePromoCode(), // Generate and add the promo code
    };

    console.log("Body: " + JSON.stringify(req.body));

    const student = await prisma.students.create({
      data: req.body,
    });

    const addNotificationtoAdmin = await prisma.Notifications.create({
      data: {
        type: "1",
        addressedTo: "admin",
        notiHead: "New Agent Account is Created!",
        notiFull: `${req.body.firstName} ${req.body.lastName} has created an account!`,
        status: "0",
      },
    });

    res.status(200).json({ message: "Account has been created!" });
  } catch (error) {
    console.error("Error registering agent:", error);
    res.status(500).json({ message: "Error creating account." });
  }
});

router.post("/login", cors(), (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    console.log(req.isAuthenticated());
    console.log(req.body);
    try {
      if (user) {
        req.login(user, (err) => {
          if (err) {
            return next(err);
          }
          console.log("User is logged in");
          console.log(req.isAuthenticated());
          return res.status(200).json({ message: "Login successful", user });
        });
      } else {
        console.log("Incorrect credentials");
        return res.status(401).json({ message: "Incorrect credentials" });
      }
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  })(req, res, next);
});

router.get(
  "/sendconfirmation/:email",
  cors(),
  authenticateToken,
  async (req, res, next) => {
    try {
      console.log(req.user.id);
      console.log(req.params.email);
      console.log(req.user);
      console.log(req.user.id);

      if (req.params.email && req.params.email !== "") {
        console.log("email: " + req.params.email);

        const generatedCodeValue = codeGenerator.codeGeneratorFunction();
        console.log("Code: " + generatedCodeValue);

        const returnValue = confirmationSend.emailsender(
          req.params.email,
          req.user.firstName,
          generatedCodeValue.toString()
        );
        console.log(returnValue);

        const updateStudent = await prisma.students.update({
          where: {
            id: req.user.id,
          },
          data: {
            code: generatedCodeValue.toString(),
          },
        });

        // Respond with updated student object
        //     res.json(updateStudent);

        //////////////////////////////////////////////////////////////////////////////////////
        // const updateStudentStatus = await prisma.students.update({
        //   where: {
        //     id: req.user.id,
        //   },
        //   data: {
        //     studentStatus: "active",
        //   },
        // });

        return res.status(201);
      } else {
        // Handle invalid email
        // return res.status(401).json({ message: "Incorrect credentials" });
      }
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
);

/////////////////
router.post(
  "/sendconfirmationforgotpassword",
  cors(),

  async (req, res, next) => {
    try {
      console.log("email is " + req.body.email);

      if (req.params.email !== "") {
        const user = await prisma.students.findUnique({
          where: {
            email: req.body.email,
          },
        });

        if (user) {
          const generatedCodeValue = codeGenerator.codeGeneratorFunction();
          console.log("Code: " + generatedCodeValue);

          const returnValue = confirmationSend.emailsender(
            req.body.email,
            "User",
            generatedCodeValue.toString()
          );
          console.log(returnValue);

          const updateStudent = await prisma.students.update({
            where: {
              email: req.body.email,
            },
            data: {
              code: generatedCodeValue.toString(),
            },
          });
          return res.status(201).json({ message: "done" });
        } else {
          console.log("No account with this email.");
          return res
            .status(500)
            .json({ message: "No account with this email." });
        }
        // Respond with updated student object
        //     res.json(updateStudent);

        return res.status(201);
      } else {
        // Handle invalid email
        // return res.status(401).json({ message: "Incorrect credentials" });
      }
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
);
////////

router.post(
  "/check_confirmation",
  // cors(),
  authenticateToken,
  async (req, res, next) => {
    try {
      console.log("UserId: " + req.user.id);
      const UserDetails = await prisma.Students.findUnique({
        where: { id: req.user.id },
      });

      console.log("Try is printed");
      console.log(UserDetails.code);
      console.log("code: " + UserDetails.code);
      if (req.body.code == UserDetails.code && req.body.code != "1136") {
        console.log("ok");
        //return res.status(201);

        const updateStudentStatus = await prisma.students.update({
          where: {
            id: req.user.id,
          },
          data: {
            studentStatus: "active",
          },
        });

        res.status(201).json({ message: "Resource created" });
      } else {
        console.log("not ok");
        res.status(401).json({ message: "Failed" });
        //return res.status(401);
      }
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
);

router.post(
  "/check_confirmation_forgotPassword",
  // cors(),
  // checkAuthenticated,
  async (req, res, next) => {
    try {
      const student = await prisma.students.findUnique({
        where: {
          email: req.body.email,
        },
      });
      console.log(student);
      console.log("Try is printed");
      console.log(req.body.code);

      if (req.body.code == student.code) {
        console.log("okey");
        return res.status(201).json({ message: "done" });
      } else {
        console.log("Not okey");
        return res.status(501).json({ message: "done" });
      }
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
);

router.post(
  "/reset_forgot_password",
  // cors(),
  // checkAuthenticated,
  async (req, res, next) => {
    console.log(req.body);
    console.log(req.body.email);

    try {
      const student = await prisma.students.findUnique({
        where: {
          email: req.body.email,
        },
      });
      console.log(student);
      const updateStudent = await prisma.students.update({
        where: {
          email: req.body.email,
        },
        // data: req.body,
        data: {
          //password: req.body.newPassword,
          password: await bcrypt.hash(req.body.password, 10),
        },
      });
      res.status(201).json({ message: "Ok" });
    } catch (error) {
      console.log("Error occurred:", error);
      return res.status(500).json({ message: "An error occurred" });
    }
  }
);

// router.post("/login", (req, res, next) => {
//   console.log(req.body);
//   passport.authenticate("local", async (err, user, info) => {
//     if (err) {
//       // Handle error, if any
//       console.log("Error:", err);
//       return res.status(500).json({ message: "An error occurred" });
//     }
//     if (!user) {
//       // Authentication failed
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     try {
//       const foundUser = await initializePassport.findUserById(user.id);
//       console.log("Found user:", foundUser);
//     } catch (error) {
//       console.log("Error finding user:", error);
//       return res.status(500).json({ message: "An error occurred" });
//     }

//     // Authentication successful
//     req.logIn(user, (err) => {
//       if (err) {
//         console.log("Error:", err);
//         return res.status(500).json({ message: "An error occurred" });
//       }
//       // Send a success response with user information
//       // return res.status(200).json({ message: "Login successful", user });
//       res.redirect(`${homeWebUrl}/`);
//       console.log("Logged In");
//     });
//   })(req, res, next);
// });
//router.post(
// "/logins",
//passport.authenticate("local", {

//  successRedirect: `${homeWebUrl}`,
// failureRedirect: `${homeWebUrl}/login`,
// failureFlash: true,
//})
//);

// router.post(
//   "/loginss",
//   (req, res, next) => {
//     passport.authenticate(
//       "local",
//       { keepSessionInfo: true },

//       (err, user, info) => {
//         if (err) {
//           return res.status(500).json({ message: "Internal server error" });
//         }
//         if (!user) {
//           req.flash("error", "Invalid credentials"); // Add flash message
//           return res.status(401).json({ message: "Invalid credentials" });
//         }
//         req.logIn(user, (err) => {
//           if (err) {
//             return res.status(500).json({ message: "Internal server error" });
//           }
//           return res.status(200).json({ message: "Login successful" });
//         });
//       }
//     )(req, res, next);
//   },
//   (req, res) => {
//     // This function is executed after the authentication process
//     // You can handle the flash messages here if needed
//     // For example, you can access the flash messages using `req.flash("error")`
//   }
// );

router.post(
  "/loginss",
  (req, res, next) => {
    passport.authenticate(
      "local",
      { keepSessionInfo: true },

      (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          req.flash("error", "Invalid credentials"); // Add flash message
          return res.status(401).json({ message: "Invalid credentials" });
        }
        req.logIn(user, (err) => {
          console.log("Account: " + user.accountType);

          if (user.accountType != "Student") {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          if (err) {
            return res.status(500).json({ message: "Internal server error" });
          }
          return res.status(200).json({ message: "Login successful" });
        });
      }
    )(req, res, next);
  },
  (req, res) => {
    // This function is executed after the authentication process
    // You can handle the flash messages here if needed
    // For example, you can access the flash messages using `req.flash("error")`
  }
);

router.post(
  "/agentlogin",
  (req, res, next) => {
    passport.authenticate(
      "local",
      { keepSessionInfo: true },

      (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          req.flash("error", "Invalid credentials"); // Add flash message
          return res.status(401).json({ message: "Invalid credentials" });
        }
        req.logIn(user, (err) => {
          console.log("Account: " + user.accountType);

          if (user.accountType != "agent") {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          if (err) {
            return res.status(500).json({ message: "Internal server error" });
          }
          return res.status(200).json({ message: "Login successful" });
        });
      }
    )(req, res, next);
  },
  (req, res) => {
    // This function is executed after the authentication process
    // You can handle the flash messages here if needed
    // For example, you can access the flash messages using `req.flash("error")`
  }
);

router.post(
  "/adminlogin",
  (req, res, next) => {
    passport.authenticate(
      "local",
      { keepSessionInfo: true },

      (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Internal server error" });
        }
        if (!user) {
          req.flash("error", "Invalid credentials"); // Add flash message
          return res.status(401).json({ message: "Invalid credentials" });
        }
        req.logIn(user, (err) => {
          console.log("Account: " + user.accountType);

          if (user.accountType != "Admin" && user.accountType != "SubAdmin") {
            return res.status(401).json({ message: "Invalid credentials" });
          }

          if (err) {
            return res.status(500).json({ message: "Internal server error" });
          }
          return res.status(200).json({ message: "Login successful" });
        });
      }
    )(req, res, next);
  },
  (req, res) => {
    // This function is executed after the authentication process
    // You can handle the flash messages here if needed
    // For example, you can access the flash messages using `req.flash("error")`
  }
);

router.post(
  "/logins",

  passport.authenticate("local", {
    successRedirect: `${homeWebUrl}`,
    failureRedirect: `${homeWebUrl}/login`,
    failureFlash: true,
  }),
  (req, res) => {
    // Custom conditions and actions
    if (req.isAuthenticated()) {
      console.log("Logged in");
      if (req.user.isAdmin) {
        // Redirect to admin dashboard
        return res.redirect(`${homeWebUrl}/admin`);
      } else if (req.user.isBlocked) {
        // Redirect to blocked user page
        return res.redirect(`${homeWebUrl}/blocked`);
      } else {
        // Redirect to regular user dashboard
        return res.redirect(`${homeWebUrl}/dashboard`);
      }
    } else {
      console.log("Not logged in");
      // Handle not logged in case, e.g., redirect to login page
      return res.redirect(`${homeWebUrl}/login`);
    }
  }
);
/////////////////////////////

// app.post('/login',  passport.authenticate('local', {
//   successRedirect: '/',
//   failureRedirect: '/login',
//   failureFlash: true
// }))

/////////////////////////////////////////

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${homeWebUrl}/login`);
  });
});

router.post("/logoutadmin", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(`${adminUrl}/login`);
  });
});
router.patch(
  "/changepassword/:id",
  authenticateToken,
  async (req, res, next) => {
    console.log(req.user.id);
    if (req.user.id) {
      console.log("first: " + JSON.stringify(req.user));

      const current_pwd_from_db = await prisma.Students.findUnique({
        where: {
          id: req.user.id,
        },
      });
      //res.json(notifications);
      console.log("Pwd from db: " + current_pwd_from_db);
      if (current_pwd_from_db) {
        if (req.user.id == req.params.id) {
          console.log("user id confirmed");
          console.log("INput pwd: " + req.body.password);
          console.log("hashed pwd: " + req.user.password);
          if (
            await bcrypt.compare(
              req.body.currentPassword,
              current_pwd_from_db.password
            )
          ) {
            console.log("correct current password");
            try {
              const { id } = req.params;
              console.log(req.params.id);
              console.log("Sent File " + req.body.currentPassword);
              console.log("" + req.params.id + "  " + req.user.password);
              const updateStudent = await prisma.students.update({
                where: {
                  id: id,
                },
                // data: req.body,
                data: {
                  //password: req.body.newPassword,
                  password: await bcrypt.hash(req.body.newPassword, 10),
                },
              });
              const addNotification = await prisma.Notifications.create({
                data: {
                  type: "0",
                  studentsId: req.user.id,
                  addressedTo: "s",
                  notiHead: "Password Changed.",
                  notiFull: "You have successfuly Changed Your password",
                  status: "0",
                },
              });
              res.status(200).json({ message: "Ok" });
              // res.json(updateStudent);
            } catch (error) {
              next(error);
            }
          } else {
            console.log("incorrect current password");
            res.status(401).json({ message: "Incorrect current password!" });
          }
        } else {
          res.json({ error: "not authorized" });
        }
      }
    } else {
      console.log("not logged in");
      res.status(401).json({ message: "not logged in" });
    }
  }
);
router.get("/profile", (req, res) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    // Access the logged-in user's information from req.user
    const user = req.user;
    res.json(user);
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});
router.get("/user", (req, res) => {
  const user = req.session.passport.user;
  // Use the user object as needed
  res.json(user);
});

function checkAuthenticated(req, res, next) {
  console.log("first");
  if (req.isAuthenticated()) {
    return next();
  }
  console.log("not done");
  res.redirect(`${homeWebUrl}/login`);
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect(`${homeWebUrl}/`);
  }
  next();
}

module.exports = router;
//module.exports = { checkAuthenticated };
module.exports.checkAuthenticated = checkAuthenticated;
module.exports.checkNotAuthenticated = checkNotAuthenticated;
