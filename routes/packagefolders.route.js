const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({});
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/parent", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { layer: "main" },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/mock", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "mock" },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/mockmain", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "mock", layer: "main" },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/mocksub", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "mock", layer: "sub" },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/mocksub/:parentname", async (req, res, next) => {
  const ParentFolderName = req.params.parentname;
  console.log("ParentName: " + ParentFolderName);
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "mock", layer: "sub", parent: ParentFolderName },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/course", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "course" },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/coursemain", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "course", layer: "main" },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/coursesub", async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "course", layer: "sub" },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

router.get("/coursesub/:parentname", async (req, res, next) => {
  const ParentFolderName = req.params.parentname;
  console.log("ParentName: " + ParentFolderName);
  try {
    const PackageFolder = await prisma.PackageFolder.findMany({
      where: { type: "course", layer: "sub", parent: ParentFolderName },
      orderBy: {
        index: "asc",
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});
//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const PackageFolder = await prisma.PackageFolder.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
    });
    res.json(PackageFolder);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  try {
    const PackageFolder = await prisma.PackageFolder.create({
      data: req.body,
    });
    res.json(PackageFolder);
  } catch (error) {}
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const PackageFolder = await prisma.PackageFolder.update({
          where: {
            id: parseInt(req.params.id),
          },
          data: req.body,
        });
        res.json(PackageFolder);
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
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        PackageFolder = await prisma.PackageFolder.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });

        res.json(PackageFolder);
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
