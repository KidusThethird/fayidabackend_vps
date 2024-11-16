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


   // console.log("User logged in:", req.user.accountType);
    // Access the logged-in user's information from req.user


    const students = await prisma.Students.findMany({
      //  include: { sections: true },
      orderBy: {
        firstName: "desc", // Replace 'score' with the actual column name you want to sort by
      },
    });
    //Student Admin

if(UserDetails){
    if (UserDetails.accountType == "Admin" || UserDetails.accountType == "SubAdmin") {
      res.json(students);
    } else {
      res.json({ Error: "You dont have access" });
    }}
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
  // try {
  //   const students = await prisma.students.findMany({
  //     include: { sections: true },
  //   });
  //   res.json(students);
  // } catch (error) {
  //   next(error);
  // }
});

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
router.get("/:id", authenticateToken, async (req, res, next) => {
  if (req.user.id) {


    const UserDetails = await prisma.Students.findUnique({
 
      where: { id: req.user.id },
     
    });
if(UserDetails){
    if (UserDetails.accountType == "Admin" || UserDetails.accountType == "SubAdmin") {
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
    }}
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
router.patch("/:id", authenticateToken, async (req, res, next) => {
 // console.log(req.isAuthenticated());
  if (req.user.id) {
    console.log("first");


    const UserDetails = await prisma.Students.findUnique({
 
      where: { id: req.user.id },
     
    });

if(UserDetails){
    if (
      UserDetails.accountType == "Admin" ||
      UserDetails.accountType == "SubAdmin" ||
      req.user.id == req.params.id
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
            notiFull: `${UserDetails.firstName} ${UserDetails.lastName} has updated his profile content!`,
            status: "0",
          },
        });
        res.json(updateStudent);
      } catch (error) {
        next(error);
      }
    } else {
      res.json({ error: "not authorized" });
    } }
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
      req.user.id == req.params.id
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
