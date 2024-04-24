const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const sendCustomEmail = require("./helper/sendCustomEmail");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const studentPrize = await prisma.StudentPrize.findMany({
      include: {
        Student: true,
        Prize: true,
      },
    });
    res.json(studentPrize);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/prizeDetail/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const studentPrize = await prisma.StudentPrize.findUnique({
      where: {
        id: id,
      },
      include: {
        Student: true,
        Prize: true,
      },
    });
    res.json(studentPrize);
  } catch (error) {
    next(error);
  }
});

router.get("/prizehistory/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params;
      const studentPrize = await prisma.StudentPrize.findMany({
        where: {
          studentsId: req.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
        include: { Prize: true },
      });

      res.json(studentPrize);
    } catch (error) {
      next(error);
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  console.log("prizeId: " + req.body.prizeId);
  console.log("prizePoints: " + req.body.prizePoint);
  if (req.isAuthenticated()) {
    // console.log("autenticated true");
    try {
      if (parseFloat(req.user.points) >= parseFloat(req.body.prizePoint)) {
        const studentPrize = await prisma.StudentPrize.create({
          data: {
            //  ...req.body, // Include data from the request
            prizeId: req.body.prizeId,
            studentsId: req.user.id, // Example of custom field
            // Example of custom field with a number value
          },
        });
        const updatedUserPoint =
          parseFloat(req.user.points) - parseFloat(req.body.prizePoint);
        console.log("frist: " + parseFloat(req.user.points));
        console.log("second: " + parseFloat(req.body.prizePoint));
        console.log("Difference: " + updatedUserPoint);

        res.json(studentPrize);

        const StudentPointUpdate = await prisma.Students.update({
          where: {
            id: req.user.id,
          },
          data: { points: updatedUserPoint.toString() },
        });

        if (studentPrize.id) {
          const studentPrizeId = studentPrize.id;
          // console.log(xid);
          const addNotification = await prisma.Notifications.create({
            data: {
              type: "0",
              studentsId: req.user.id,
              addressedTo: "s",
              notiHead: "Prize Ordered!",
              notiFull: `You have successfuly ordered [${req.body.itemName}] with Prize Order Id  ${studentPrizeId}`,
              status: "0",
            },
          });

          const addNotificationtoAdmin = await prisma.Notifications.create({
            data: {
              type: "1",

              //studentsId: req.user.id,
              addressedTo: "admin",
              notiHead: `${req.user.firstName} Ordered a Prize!`,
              notiFull: `${req.user.firstName} ${req.user.lastName} has Ordered a [${req.body.itemName}], Prize!`,
              status: "0",
            },
          });

          const returnValue = sendCustomEmail.emailsender(
            req.user.email,
            req.user.firstName,
            "Prize Order Successful!",
            `You have ordered a prize [${req.body.itemName}] with prize order Id [${studentPrizeId}], `,
            "We will reach out to you as soon as possible!"
          );
          console.log(returnValue);
        }
      }

      console.log("requested: " + req.body);
    } catch (error) {}
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        // console.log("we are here");
        const { id } = req.params;
        const studentPrize = await prisma.StudentPrize.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        res.json(studentPrize);
      } catch (error) {
        next(error);
      }
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//delete Student
router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const studentPrize = await prisma.StudentPrize.delete({
          where: {
            id: id,
          },
        });

        res.json(studentPrize);
      } catch (error) {
        next(error);
      }
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

module.exports = router;
