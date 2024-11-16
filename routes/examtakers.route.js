const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const authenticateToken = require("./authMiddleware");


//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const Student = await prisma.ExamTaker.findMany({});
    res.json(Student);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const Student = await prisma.ExamTaker.findUnique({
      where: {
        id: id,
      },
    });
    res.json(Student);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  console.log("You are in post");

  console.log("data: " + JSON.stringify(req.body));
  try {
    const Student = await prisma.ExamTaker.create({
      data: req.body,
    });
    res.json(Student);
  } catch (error) {}
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        const updateSection = await prisma.ExamTaker.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        res.json(updateSection);
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
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        student = await prisma.ExamTaker.delete({
          where: {
            id: id,
          },
        });

        res.json(student);
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
