const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const RegionSelected = await prisma.Region.findMany({
      orderBy: {
        regionName: "asc",
      },
    });
    res.json(RegionSelected);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const RegionSelected = await prisma.Region.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(RegionSelected);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  try {
    const RegionSelected = await prisma.Region.create({
      data: req.body,
    });
    res.json(RegionSelected);
  } catch (error) {}
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        const RegionSelected = await prisma.Region.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: req.body,
        });
        res.json(RegionSelected);
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
        RegionSelected = await prisma.Region.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });

        res.json(RegionSelected);
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
