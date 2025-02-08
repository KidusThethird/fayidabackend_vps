const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const checkNotAuthenticated = require("./login_register.route");
const authenticateToken = require("./authMiddleware");

const cors = require("cors");

router.use(cors({ credentials: true, origin: true }));

//working with students

//Get all student
router.get("/", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.user.id },
    });

    //console.log("User logged in:", req.user.accountType);
    // Access the logged-in user's information from req.user
    const students = await prisma.Students.findMany({
      where: {
        accountType: "agent", // filter for agents
      },
      orderBy: {
        firstName: "desc",
      },
    });
    //Student Admin
    if (
      UserDetails.accountType == "Admin" ||
      UserDetails.accountType == "SubAdmin" ||
      UserDetails.accountType == "Assistant"
    ) {
      res.json(students);
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get(
  "/studentswithpromocode/:promoCode",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      const { promoCode } = req.params; // Get the promo code from the URL parameters

      // console.log("User logged in:", req.user.accountType);

      // Find students where accountType is 'student' and promoCode matches the provided param
      const students = await prisma.Students.findMany({
        where: {
          accountType: "student", // filter for students
          promocode: promoCode, // filter where promoCode matches the param
        },
        orderBy: {
          firstName: "desc", // Order by first name in descending order
        },
      });

      // Allow access only for Admin or SubAdmin

      res.json(students);
    } catch (error) {
      next(error);
    }
  }
);

router.get("/config/commison", async (req, res, next) => {
  try {
    const Commison = await prisma.Configuration.findFirst({});
    res.json(Commison);
  } catch (error) {
    next(error);
  }
});

router.patch(
  "/config/commison/:id",
  authenticateToken,
  async (req, res, next) => {
    if (req.user.id) {
      const UserDetails = await prisma.Students.findUnique({
        where: { id: req.user.id },
      });

      if (
        UserDetails.accountType == "Admin" ||
        UserDetails.accountType == "SubAdmin" ||
        UserDetails.accountType == "Assistant"
      ) {
        try {
          const { id } = req.params;
          const CitySelected = await prisma.Configuration.update({
            where: {
              id: req.params.id,
            },
            data: req.body,
          });
          res.json(CitySelected);
        } catch (error) {
          next(error);
        }
      } else {
        res.json({ Error: "You dont have access" });
      }
    } else {
      res.json({ Error: "You dont have access" });
    }
  }
);

router.get(
  "/checkpackageexpirydate/",
  checkAuthenticated,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      console.log("User logged in:", req.user.accountType);

      const today = new Date();
      const fiveDaysFromNow = new Date();
      fiveDaysFromNow.setDate(today.getDate() + 5);

      const TobeExpiredPackages = await prisma.PurchaseList.findFirst({
        where: {
          studentsId: req.user.id,
          paymentStatus: "active",
          expiryDate: {
            lte: fiveDaysFromNow,
          },
        },
        include: { Package: true },
      });
      if (TobeExpiredPackages) {
        console.log(
          `Expiring Package Found ${TobeExpiredPackages.Package.packageName}`
        );
        res.status(201).json({ message: "found" });
      } else {
        res.status(201).json({ message: "not_found" });
      }
      // res.json(TobeExpiredPackages);
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

//temporary all student access
// router.get("/t", async (req, res, next) => {
//   // Access the logged-in user's information from req.user
//   const students = await prisma.students.findMany({
//     include: { sections: true },
//   });

//   res.json(students);
// });

//Get one student
router.get("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      req.user.accountType == "Admin" ||
      req.user.accountType == "SubAdmin" ||
      UserDetails.accountType == "Assistant"
    ) {
      try {
        const { id } = req.params;
        const singleStudent = await prisma.students.findUnique({
          where: {
            id: id,
          },
          include: { sections: true, purchaselist: true },
        });
        res.json(singleStudent);
      } catch (error) {
        next(error);
      }
    } else {
      try {
        const { id } = req.params;
        const singleStudent = await prisma.students.findUnique({
          where: {
            id: id,
          },
          include: { sections: true, purchaselist: true },
        });
        if (req.user.id == req.params.id) {
          res.json(singleStudent);
        } else {
          res.json({ Error: "You are not Authorized" });
        }
      } catch (error) {
        next(error);
      }
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const student = await prisma.students.create({
      data: req.body,
    });

    res.json(student);
  } catch (error) {}
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  console.log(req.isAuthenticated());
  if (req.isAuthenticated()) {
    console.log("first");
    if (
      req.user.accountType == "Admin" ||
      req.user.accountType == "SubAdmin" ||
      req.user.id == req.params.id ||
      UserDetails.accountType == "Assistant"
    ) {
      try {
        const { id } = req.params;
        console.log(req.params.id);

        const updateStudent = await prisma.students.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        const addNotification = await prisma.Notifications.create({
          data: {
            type: "0",
            studentsId: req.user.id,
            addressedTo: "s",
            notiHead: "Update Successful.",
            notiFull: "You have successfuly Updated your profile.",
            status: "0",
          },
        });

        const addNotificationtoAdmin = await prisma.Notifications.create({
          data: {
            type: "1",

            //studentsId: req.user.id,
            addressedTo: "admin",
            notiHead: "Student Account is Updated!",
            notiFull: `${req.user.firstName} ${req.user.lastName} has updated his profile content!`,
            status: "0",
          },
        });
        res.json(updateStudent);
      } catch (error) {
        next(error);
      }
    } else {
      res.json({ error: "not authorized" });
    }
  } else {
    console.log("not logged in");
    res.status(401).json({ message: "not logged in" });
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      req.user.accountType == "Admin" ||
      req.user.accountType == "SubAdmin" ||
      req.user.id == req.params.id ||
      UserDetails.accountType == "Assistant"
    ) {
      try {
        const { id } = req.params;
        deleteStudent = await prisma.students.delete({
          where: {
            id: id,
          },
        });

        const addNotificationtoAdmin = await prisma.Notifications.create({
          data: {
            type: "1",

            //studentsId: req.user.id,
            addressedTo: "admin",
            notiHead: "Student Account is Deleted!",
            notiFull: `${req.user.firstName} ${req.user.lastName} has been an deleted!`,
            status: "0",
          },
        });
        res.json(deleteStudent);
      } catch (error) {
        next(error);
      }
    } else {
      res.json({ error: "not authorized" });
    }
  } else {
    res.json({ message: "not logged in." });
  }
});

module.exports = router;
