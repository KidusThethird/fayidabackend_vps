const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const sections = await prisma.StudentAssessement.findMany({});
    res.json(sections);
  } catch (error) {
    next(error);
  }
});
router.get("/student/", checkAuthenticated, async (req, res, next) => {
  try {
    const sections = await prisma.StudentAssessement.findMany({
      where: {
        studentId: req.user.id,
      },
    });
    res.json(sections);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

//Get one student

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleSection = await prisma.StudentAssessement.findUnique({
      where: {
        id: id,
      },
    });
    res.json(singleSection);
  } catch (error) {
    next(error);
  }
});

router.get("/assessmentId/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleSection = await prisma.StudentAssessement.findMany({
      where: {
        assessmentId: id,
      },
    });
    res.json(singleSection);
  } catch (error) {
    next(error);
  }
});

router.get("/studentId/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleSection = await prisma.StudentAssessement.findMany({
      where: {
        studentId: id,
      },
    });
    res.json(singleSection);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      req.user.accountType == "Admin" ||
      req.user.accountType == "SubAdmin" ||
      req.user.accountType == "Assistant"
    ) {
      try {
        const section = await prisma.StudentAssessement.create({
          data: req.body,
        });
        res.json(section);
      } catch (error) {}
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      req.user.accountType == "Admin" ||
      req.user.accountType == "SubAdmin" ||
      req.user.accountType == "Assistant"
    ) {
      try {
        const { id } = req.params;
        const updateSection = await prisma.StudentAssessement.update({
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
    if (
      req.user.accountType == "Admin" ||
      req.user.accountType == "SubAdmin" ||
      req.user.accountType == "Assistant"
    ) {
      try {
        const { id } = req.params;
        deleteSection = await prisma.StudentAssessement.delete({
          where: {
            id: id,
          },
        });

        res.json(deleteSection);
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
