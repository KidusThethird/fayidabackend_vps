const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const authenticateToken = require("./authMiddleware");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const CitySelected = await prisma.packagesReview.findMany({});
    res.json(CitySelected);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params.id;
    console.log("rec: " + req.params.id);
    const CitySelected = await prisma.packagesReview.findUnique({
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
router.post("/", authenticateToken, async (req, res, next) => {
  console.log("Data req: " + JSON.stringify(req.body));
  if (req.user.id && req.user.id == req.body.studentId) {
    try {
      const CitySelected = await prisma.packagesReview.create({
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
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params;
      const CitySelected = await prisma.packagesReview.update({
        where: {
          id: parseInt(req.params.id),
          studentId: req.user.id,
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
});

//delete Student
router.delete("/:id", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    try {
      const { id } = req.params;
      CitySelected = await prisma.packagesReview.delete({
        where: {
          id: parseInt(req.params.id),
          studentId: req.user.id,
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
