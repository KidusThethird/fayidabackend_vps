const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const checkAuthenticated = require("./login_register.route");
const prisma = new PrismaClient();
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

//working with students

//Get all student
router.get("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const questions = await prisma.questions.findMany({});
        res.json(questions);
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

//Get one student
router.get("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "Student") {
      try {
        const { id } = req.params;
        const singleQuestion = await prisma.questions.findUnique({
          where: {
            id: id,
          },
          include: { assesment: true },
        });

        if (singleQuestion) {
          console.log("in payment with id 2");
          const signedUrlforFileforQuestion = await generateSignedUrl(
            "generalfilesbucket",
            "question_images",
            singleQuestion.questionImage
          );
          console.log("print of x: " + signedUrlforFileforQuestion);
          res.json({
            ...singleQuestion,
            questionImgUrl: signedUrlforFileforQuestion,
          });
        }

        //  res.json(singleQuestion);
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

//Get one student
router.get("/accessquestions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const allAssesmentQuestion = await prisma.questions.findMany({
      where: {
        assesmentId: id,
      },
      orderBy: {
        questionIndex: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });

    const questionWithSignedUrls = await Promise.all(
      allAssesmentQuestion.map(async (question) => {
        const signedUrlforFileforquestion = await generateSignedUrl(
          "generalfilesbucket",
          "question_images",
          question.questionImage
        );

        const signedUrlforFileforcorrection = await generateSignedUrl(
          "generalfilesbucket",
          "question_images",
          question.correctionImage
        );

        return {
          ...question,
          questionImgUrl: signedUrlforFileforquestion,
          correctionImageUrl: signedUrlforFileforcorrection,
        };
      })
    );

    res.json(questionWithSignedUrls);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const question = await prisma.questions.create({
          data: req.body,
        });
        res.json(question);
      } catch (error) {}
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const updateQuestions = await prisma.questions.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        res.json(updateQuestions);
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
        deleteQuestions = await prisma.questions.delete({
          where: {
            id: id,
          },
        });
        res.json(deleteQuestions);
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
