const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require(".././login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const CategoryList = await prisma.CategoriesList.findMany({
      orderBy: {
        index: "asc",
      },
      include: { CategoryFolders: true },
    });
    res.json(CategoryList);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params.id;
    console.log("rec: " + req.params.id);
    const CategoryList = await prisma.CategoriesList.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(CategoryList);
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  //  console.log("Req: " + req.body.cityName);
  try {
    const CategoryList = await prisma.CategoriesList.create({
      data: req.body,
    });
    res.json(CategoryList);
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
        const CategoryList = await prisma.CategoriesList.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: req.body,
        });
        res.json(CategoryList);
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
        CategoryList = await prisma.CategoriesList.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });

        res.json(CategoryList);
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
