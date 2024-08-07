const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require(".././login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const KeyWord = await prisma.KeyWordsList.findMany({
      // orderBy: {
      //   index: "asc",
      // },
    });
    res.json(KeyWord);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params.id;
    console.log("rec: " + req.params.id);
    const KeyWord = await prisma.KeyWordsList.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(KeyWord);
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  //  console.log("Req: " + req.body.cityName);
  try {
    const KeyWord = await prisma.KeyWordsList.create({
      data: req.body,
    });
    res.json(KeyWord);
  } catch (error) {
    console.log("Error from catch: " + error);
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        const KeyWord = await prisma.KeyWordsList.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: req.body,
        });
        res.json(KeyWord);
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
        KeyWord = await prisma.KeyWordsList.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });

        res.json(KeyWord);
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
