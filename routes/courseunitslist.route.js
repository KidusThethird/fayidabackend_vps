const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const CitySelected = await prisma.CourseUnitsList.findMany({});
    res.json(CitySelected);
  } catch (error) {
    next(error);
  }
});
//Get all student
router.get("/filtercourse/:courseId", async (req, res, next) => {
  const courseId = req.params.courseId;
  console.log("CourseId" + req.params.courseId);
  try {
    const CitySelected = await prisma.CourseUnitsList.findMany({
      where: {
        CourseId: courseId,
      },
      orderBy: {
        UnitNumber: "asc",
      },
    });
    res.json(CitySelected);
  } catch (error) {
    console.log("error from catch: " + error);
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const CitySelected = await prisma.CourseUnitsList.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(CitySelected);
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  console.log("Data req: " + JSON.stringify(req.body));
  if (
    req.isAuthenticated() &&
    (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin")
  ) {
    try {
      const CitySelected = await prisma.CourseUnitsList.create({
        data: req.body,
      });
      res.json(CitySelected);
    } catch (error) {
      console.log("Error from catch: " + error);
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin")
  ) {
    try {
      const { id } = req.params;
      const CitySelected = await prisma.CourseUnitsList.update({
        where: {
          id: parseInt(req.params.id),
        },
        data: req.body,
      });
      res.json(CitySelected);
    } catch (error) {
      console.log("Error from catch: " + error);
      next(error);
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//delete Student
router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (
    req.isAuthenticated() &&
    (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin")
  ) {
    try {
      const { id } = req.params;
      CitySelected = await prisma.CourseUnitsList.delete({
        where: {
          id: parseInt(req.params.id),
        },
      });

      res.json(CitySelected);
    } catch (error) {
      next(error);
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

module.exports = router;
