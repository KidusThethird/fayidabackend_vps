const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require(".././login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const CategoryFolder = await prisma.CategoryFolders.findMany({
      //   orderBy: {
      //     index: "asc",
      //   },
      include: { CategoryListFamily: true, KeyWords: true },
    });
    res.json(CategoryFolder);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params.id;
    console.log("rec: " + req.params.id);
    const CategoryFolder = await prisma.CategoryFolders.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: { CategoryListFamily: true, KeyWords: true },
    });
    res.json(CategoryFolder);
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  // console.log("Req: " + req.body.cityName);
  try {
    const CategoryFolder = await prisma.CategoryFolders.create({
      data: req.body,
    });
    res.json(CategoryFolder);
  } catch (error) {
    console.log("Error from catch: " + error);
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  console.log("Patch is here");
  console.log("Req: " + req.body);
  console.log("ReqD: " + JSON.stringify(req.body));
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      console.log("In Auth");
      try {
        const { id } = req.params;
        console.log("Id of Folder: " + req.params.id);
        console.log("Req: " + req.body);
        console.log("ReqD: " + JSON.stringify(req.body));
        const CategoryFolder = await prisma.CategoryFolders.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: req.body,
        });
        // console.log("CategoryFolderData: " + JSON.stringify(data));
        res.json(CategoryFolder);
      } catch (error) {
        console.log("Error from catch: " + error);
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
        CategoryFolder = await prisma.CategoryFolders.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });

        res.json(CategoryFolder);
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
