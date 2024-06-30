const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/x", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const maleExamTakersCount = await prisma.ExamTaker.count({
          where: {
            gender: "male",
          },
        });
        const femaleExamTakersCount = await prisma.ExamTaker.count({
          where: {
            gender: "female",
          },
        });

        const citiesWithExamTakers = await prisma.ExamTaker.groupBy({
          by: ["city"],
          _count: {
            id: true,
          },
          orderBy: {
            _count: {
              id: "desc",
            },
          },
        });

        //    res.json({ maleExamTakersCount });
        res.json({ test: "test" });
      } catch (error) {
        next(error);
      }
    }
  }
});

router.get("/", async (req, res, next) => {
  try {
    const maleExamTakersCount = await prisma.ExamTaker.count({
      where: {
        gender: "male",
      },
    });
    const femaleExamTakersCount = await prisma.ExamTaker.count({
      where: {
        gender: "female",
      },
    });
    const gendersWithExamTakers = await prisma.ExamTaker.groupBy({
      by: ["gender"],
      _count: {
        id: true,
      },
    });

    const citiesWithExamTakers = await prisma.ExamTaker.groupBy({
      by: ["city"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    res.json({
      gendersWithExamTakers,
      citiesWithExamTakers,
    });
    // res.json({ test: "test" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
