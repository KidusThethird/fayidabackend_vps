const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student

router.get("/all", async (req, res, next) => {
  try {
    const leaderBoard = await prisma.Students.findMany({
      orderBy: {
        points: "desc", // Replace 'score' with the actual column name you want to sort by
      },
    });
    res.json(leaderBoard);
  } catch (error) {
    next(error);
  }
});

router.get("/all/topten", async (req, res, next) => {
  try {
    const leaderBoard = await prisma.Students.findMany({
      orderBy: {
        points: "desc", // Replace 'score' with the actual column name you want to sort by
      },
      include: {
        sections: true,
      },
      take: 10,
    });
    res.json(leaderBoard);
  } catch (error) {
    next(error);
  }
});

router.get("/all/toptwenty", async (req, res, next) => {
  try {
    const leaderBoard = await prisma.Students.findMany({
      orderBy: {
        points: "desc", // Replace 'score' with the actual column name you want to sort by
      },
      include: {
        sections: true,
      },
      take: 20,
    });
    res.json(leaderBoard);
  } catch (error) {
    next(error);
  }
});

router.get("/grade/topten/:grade", async (req, res, next) => {
  try {
    const leaderBoard = await prisma.Students.findMany({
      orderBy: {
        points: "desc", // Replace 'score' with the actual column name you want to sort by
      },

      where: {
        gread: req.params.grade,
      },
      include: {
        sections: true,
      },
      take: 10,
    });
    res.json(leaderBoard);
  } catch (error) {
    next(error);
  }
});

router.get("/grade/toptwenty/:grade", async (req, res, next) => {
  try {
    const leaderBoard = await prisma.Students.findMany({
      orderBy: {
        points: "desc", // Replace 'score' with the actual column name you want to sort by
      },
      where: {
        gread: req.params.grade,
      },
      include: {
        sections: true,
      },
      take: 20,
    });
    res.json(leaderBoard);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
