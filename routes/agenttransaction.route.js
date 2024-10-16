const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const CitySelected = await prisma.agentTransaction.findMany({});
    res.json(CitySelected);
  } catch (error) {
    next(error);
  }
});

router.get("/withpromocode/:promocode", async (req, res, next) => {
  try {
    const { promocode } = req.params; // Get the promo code from the URL parameters

    const CitySelected = await prisma.agentTransaction.findMany({
      where: {
        promocode: promocode, // Filter for matching promoCode
      },
      orderBy: {
        createdAt: "desc", // Sort by createdAt with the most recent first
      },
    });

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
    const CitySelected = await prisma.agentTransaction.findUnique({
      where: {
        id: req.params.id,
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
  //console.log("Req: " + req.body.cityName);
  try {
    const CitySelected = await prisma.agentTransaction.create({
      data: req.body,
    });
    res.json(CitySelected);
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
        const CitySelected = await prisma.agentTransaction.update({
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
});

//delete Student
router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        CitySelected = await prisma.agentTransaction.delete({
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
  } else {
    res.json({ Error: "You dont have access" });
  }
});

module.exports = router;
