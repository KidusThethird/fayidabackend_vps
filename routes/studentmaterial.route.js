const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const CitySelected = await prisma.StudentMaterial.findMany({});
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
    const CitySelected = await prisma.StudentMaterial.findUnique({
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
  if (req.isAuthenticated()) {
    console.log("User Name: " + req.user.firstName);

    try {
      const existingRecord = await prisma.studentMaterial.findFirst({
        where: {
          StudentId: req.user.id,
          MaterialId: req.body.MaterialId,
        },
      });

      if (!existingRecord) {
        const StudentMaterialPost = await prisma.StudentMaterial.create({
          data: {
            ...req.body,
            StudentId: req.user.id,
            Done: true,
          },
        });
        res.json(StudentMaterialPost);
      }
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
      const CitySelected = await prisma.StudentMaterial.update({
        where: {
          id: parseInt(req.params.id),
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
router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        CitySelected = await prisma.StudentMaterial.delete({
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
