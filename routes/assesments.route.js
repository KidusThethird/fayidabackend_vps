const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const cors = require("cors");

router.use(cors({ credentials: true, origin: true }));

//working with students

//Get all student
router.get("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "Student") {
      try {
        const assesments = await prisma.assesment.findMany({});
        res.json(assesments);
      } catch (error) {
        console.log("error from catch: " + error);
        next(error);
      }
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

router.get("/getexams/", checkAuthenticated, async (req, res, next) => {
  try {
    const assesments = await prisma.assesment.findMany({
      where: {
        assessmentType: "exam",
      },
      orderBy: {
        assesmentIndex: "asc",
      },
    });
    res.json(assesments);
  } catch (error) {
    next(error);
  }
});

router.get("/getexams/:id", checkAuthenticated, async (req, res, next) => {
  try {
    const assesments = await prisma.assesment.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        question: {
          orderBy: {
            questionIndex: "asc",
          },
        },
      },
    });
    res.json(assesments);
  } catch (error) {
    console.log("Error from Catch: " + error);
    next(error);
  }
});

router.post(
  "/submit-answers/:assessment_id",
  checkAuthenticated,
  async (req, res) => {
    const { answers } = req.body;

    try {
      const { id } = req.params;
      const singleAssesment = await prisma.assesment.findUnique({
        where: {
          id: req.params.assessment_id,
        },
        include: {
          question: {
            orderBy: {
              questionIndex: "asc",
            },
          },
        },
      });

      const CheckStudentAssesment = await prisma.StudentAssessement.findMany({
        where: {
          studentId: req.user.id,
          assessmentId: req.params.assessment_id,
        },
      });
      const FetchStudent = await prisma.Students.findUnique({
        where: {
          id: req.user.id,
        },
      });
      const StudnetRegisterdScore = FetchStudent.points;
      const assesmentPoint = singleAssesment.assesmentPoints;
      const totalquestions = singleAssesment.question.length;
      console.log("Assessment Id: " + req.params.assessment_id);
      let exactMatches = 0;
      const correctChoices = singleAssesment.question.map((question) => {
        return question.correctChoice; // Assuming the property is named 'CorrectCHoice'
      });
      // console.log("Correct Choices: " + correctChoices);
      // console.log("Recived Choces: " + req.body);
      console.log("Correct Choices:", JSON.stringify(correctChoices, null, 2));
      console.log(
        "Received Choices:",
        JSON.stringify(req.body.answers, null, 2)
      );

      const incorrectQuestionNumbers = [];

      for (let i = 0; i < correctChoices.length; i++) {
        const correctChoice = correctChoices[i].toLowerCase(); // Convert to lowercase
        const userAnswer = req.body.answers[i].toLowerCase(); // Convert to lowercase

        if (correctChoice === userAnswer) {
          exactMatches++;
        } else {
          incorrectQuestionNumbers.push(i); // Add 1 to convert zero-based index to question number
        }
      }

      // for (let i = 0; i < correctChoices.length; i++) {
      //   if (correctChoices[i] === req.body.answers[i]) {
      //     exactMatches++;
      //   }
      // }
      console.log("AssessmnetPoint: ", assesmentPoint);
      console.log("TotalNumberOfQuestions: ", totalquestions);
      const singlequestionpoint = assesmentPoint / totalquestions;
      var calculatedPoint = 0;
      var updatedRegisteredPoint = 0;
      if (parseFloat(singlequestionpoint) > 0) {
        calculatedPoint = exactMatches * singlequestionpoint;
        updatedRegisteredPoint =
          parseFloat(StudnetRegisterdScore) + parseFloat(calculatedPoint);

        console.log("singlequestionPoint: ", singlequestionpoint);
        console.log("CalculatedPoint: ", calculatedPoint.toString());
        console.log("UpdatedScore: " + updatedRegisteredPoint);
      }

      console.log("Exact matches:", exactMatches);
      console.log("studentId: " + req.user.id);

      console.log("CheckAssessemnt: " + CheckStudentAssesment.length);

      if (CheckStudentAssesment.length == "0") {
        const createStudentAssessmentPoint =
          await prisma.StudentAssessement.create({
            data: {
              studentId: req.user.id,
              assessmentId: req.params.assessment_id,
              Score: calculatedPoint.toString(),
              CorrectAnswers: exactMatches.toString(),
            },
          });
        console.log("Text: " + updatedRegisteredPoint);
        const updateSection = await prisma.Students.update({
          where: {
            id: req.user.id,
          },
          data: {
            points: updatedRegisteredPoint.toString(),
          },
        });
      }
      console.log("Incorrect: " + incorrectQuestionNumbers);
      //if the student didnt take the exam before, we give it a mark in the database
      if (CheckStudentAssesment.length == "0") {
        res.json({
          message: `You have Answered ${exactMatches} out of ${totalquestions} Questions Correctly. You have added ${calculatedPoint.toString()} points to your Profile. `,
          incorrectQuestionNumbers: incorrectQuestionNumbers,
        });
      } else {
        res.json({
          message: `You have Answered ${exactMatches} out of ${totalquestions} Questions Correctly.`,
          incorrectQuestionNumbers: incorrectQuestionNumbers,
        });
      }
    } catch (error) {
      //next(error);
      console.log(error);
    }

    // Process answers (e.g., store in database, calculate score)
    console.log(req.body);
  }
);

router.post(
  "/submit-exam-answers/:assessment_id",
  checkAuthenticated,
  async (req, res) => {
    const { answers } = req.body;

    try {
      const { id } = req.params;
      const singleAssesment = await prisma.assesment.findUnique({
        where: {
          id: req.params.assessment_id,
        },
        include: {
          question: {
            orderBy: {
              questionIndex: "asc",
            },
          },
        },
      });

      const assesmentPoint = singleAssesment.assesmentPoints;
      const totalquestions = singleAssesment.question.length;
      console.log("Assessment Id: " + req.params.assessment_id);
      let exactMatches = 0;
      const correctChoices = singleAssesment.question.map((question) => {
        return question.correctChoice; // Assuming the property is named 'CorrectCHoice'
      });
      console.log("Correct Choices: " + correctChoices);
      console.log("Recived Choces: " + req.body);
      console.log("Correct Choices:", JSON.stringify(correctChoices, null, 2));
      console.log(
        "Received Choices:",
        JSON.stringify(req.body.answers, null, 2)
      );

      const incorrectQuestionNumbers = [];

      for (let i = 0; i < correctChoices.length; i++) {
        const correctChoice = correctChoices[i].toLowerCase(); // Convert to lowercase
        const userAnswer = req.body.answers[i].toLowerCase(); // Convert to lowercase

        if (correctChoice === userAnswer) {
          exactMatches++;
        } else {
          incorrectQuestionNumbers.push(i); // Add 1 to convert zero-based index to question number
        }
      }
      console.log("AssessmnetPoint: ", assesmentPoint);
      console.log("TotalNumberOfQuestions: ", totalquestions);
      const singlequestionpoint = 100 / totalquestions;
      var calculatedPoint = 0;

      calculatedPoint = exactMatches * singlequestionpoint;
      calculatedPoint = calculatedPoint.toFixed(1);

      console.log("singlequestionPoint: ", singlequestionpoint);
      console.log("CalculatedPoint: ", calculatedPoint.toString());

      console.log("Exact matches:", exactMatches);
      console.log("Incorrect: " + incorrectQuestionNumbers);
      res.json({
        message: `You have Answered ${exactMatches} out of ${totalquestions} Questions Correctly. You scored ${calculatedPoint.toString()}% `,
        incorrectQuestionNumbers: incorrectQuestionNumbers,
      });
    } catch (error) {
      //next(error);
      console.log(error);
    }

    // Process answers (e.g., store in database, calculate score)
    console.log(req.body);
  }
);

//Get one student
router.get("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (
      req.user.accountType == "Admin" ||
      req.user.accountType == "SubAdmin" ||
      req.user.accountType == "Student"
    ) {
      try {
        const { id } = req.params;
        const singleAssesment = await prisma.assesment.findUnique({
          where: {
            id: id,
          },
        });
        res.json(singleAssesment);
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

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  console.log("Printed one");

  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        console.log("req: " + JSON.stringify(req.body));
        const assesment = await prisma.assesment.create({
          data: req.body,
        });
        res.json(assesment);
      } catch (error) {
        console.log("Error from catch : " + error);
      }
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
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        const updateAssesment = await prisma.assesment.update({
          where: {
            id: id,
          },
          include: { question: true },
          data: req.body,
        });
        res.json(updateAssesment);
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
        deleteAssesment = await prisma.assesment.delete({
          where: {
            id: id,
          },
        });
        res.json(deleteAssesment);
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
