const router = require("express").Router();
//add this
const express = require("express");
const { Storage } = require("@google-cloud/storage");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
//const { Storage } = require("@google-cloud/storage");
//const { generateSignedUrl } = require("./helper/bucketurlgenerator");
//const sendCustomEmail = require("./helper/sendCustomEmail");

const prisma = new PrismaClient();

const path = require("path");
const http = require("http");
const cors = require("cors");

var fileNameSaved = "";

//middlewares to encode
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

//multer storage
const upload = multer({
  storage: multer.memoryStorage(),
});

const checkAuthenticated = require("./login_register.route");
//cloud storage connection
const storage = new Storage({
  keyFilename: "key.json",
});
const bucketName = "generalfilesbucket";
const bucket = storage.bucket(bucketName);
//botquestionimages
//post request
router.post(
  "/upload_botquestion_image/:id",
  upload.single("bot_question_image"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singlequestion = await prisma.BotQuestions.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singlequestion) {
      if (!singlequestion.image) {
        console.log("No prior Image found!");
      } else if (singlequestion.image != null || singlequestion.image != "") {
        olderFileName = singlequestion.image;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `botquestionimages/${olderFileName}`;
          //const blob = bucket.file(filePath);
          try {
            await bucket.file(filePath).delete();
            console.log("Older File Deleted");
          } catch (error) {
            console.log("Error: " + error);
          }
        }
      } else {
        console.log("New file");
      }
    }

    const fileName = Date.now() + "-" + file.originalname;
    const filePath = `botquestionimages/${fileName}`;
    // convert to a blob

    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    blobStream.on("error", (err) => {
      res.status(500).send(err);
    });
    blobStream.on("finish", async () => {
      console.log("Blob Finished!");
      console.log("FIle Name: " + fileName);
      console.log("Id: " + req.params.id);

      const updatgeBotquestion = await prisma.BotQuestions.update({
        where: {
          id: req.params.id,
        },
        data: { image: fileName },
      });
      //   res.json(updatePaymentMethod);

      res.status(201).json({
        message: "File uploaded successfully!",
        fileName: file.originalname,
      });
    });

    blobStream.end(file.buffer);
  }
);

{
  /***************************************************

****************************************************
****************************************************
****************************************************


*/
}

//Get all student
router.get("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const Questions = await prisma.BotQuestions.findMany({
          //include: { courses: true },
        });
        res.json(Questions);
      } catch (error) {
        console.log("Error from catch: " + error);
        next(error);
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get("/answers", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const Questions = await prisma.BotQuestionAnswer.findMany({
          //include: { courses: true },
        });
        res.json(Questions);
      } catch (error) {
        console.log("Error from catch: " + error);
        next(error);
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get(
  "/filtergrade/:grade",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      const gradeParam = req.params.grade; // Get the grade from the request params

      // Fetch the first active question with the matching grade
      const question = await prisma.BotQuestions.findFirst({
        where: {
          grade: gradeParam, // Filter by grade
          status: "active", // Filter by active status
        },
      });

      if (question) {
        console.log("in payment with id 2");

        const signedUrlforThumbnail = await generateSignedUrl(
          "generalfilesbucket",
          "botquestionimages",
          question.image
        );

        const packageWithUrls = {
          ...question,

          imgUrl: signedUrlforThumbnail[0],
        };

        console.log("print of x: " + packageWithUrls);
        res.json(packageWithUrls);
      } else {
        res
          .status(404)
          .json({ message: "No active questions found for this grade." });
      }
    } catch (error) {
      console.log("Error from catch: " + error);
      next(error);
    }
  }
);

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singlePackage = await prisma.BotQuestions.findUnique({
      where: {
        id: id,
      },
    });

    if (singlePackage) {
      console.log("in payment with id 2");

      const signedUrlforThumbnail = await generateSignedUrl(
        "generalfilesbucket",
        "botquestionimages",
        singlePackage.image
      );

      const packageWithUrls = {
        ...singlePackage,

        imgUrl: signedUrlforThumbnail,
      };

      console.log("print of x: " + packageWithUrls);
      res.json(packageWithUrls);
    }
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      console.log("Body: " + JSON.stringify(req.body));
      try {
        const package = await prisma.BotQuestions.create({
          data: req.body,
        });
        res.json(package);
      } catch (error) {}
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.post("/answers", checkAuthenticated, async (req, res, next) => {
  console.log("Body: " + JSON.stringify(req.body));

  const studentId = req.body.userId;
  const questionId = req.body.questionId;
  const studentsAnswer = req.body.text;

  try {
    // Fetch the question by its ID
    const question = await prisma.BotQuestions.findUnique({
      where: { id: questionId },
    });

    // Check if the question is active
    if (!question || question.status !== "active") {
      console.log("Too late");
      return res.status(400).json({
        message: "You are too late, the question is deactivated.",
      });
    }

    // Check if the student has already submitted an answer for the same question
    const existingSubmission = await prisma.BotQuestionAnswer.findFirst({
      where: {
        studentId: studentId,
        questionId: questionId,
      },
    });

    if (existingSubmission) {
      console.log("You cant submit twice");
      return res.status(400).json({
        message: "You can only submit once!",
      });
    }

    // Submit the data to BotQuestionAnswer model
    const submission = await prisma.BotQuestionAnswer.create({
      data: {
        studentId: studentId,
        questionId: questionId,
        text: studentsAnswer,
      },
    });

    // Send a success message
    res.status(201).json({
      message: "Your answer has been submitted successfully!",
      submission, // Include the submission details if needed
    });
  } catch (error) {
    console.error("Error submitting answer:", error);
    res
      .status(500)
      .json({ message: "An error occurred while submitting your answer." });
  }
});

// router.post("/answers", checkAuthenticated, async (req, res, next) => {
//   console.log("Body: " + JSON.stringify(req.body));

//   const StudentId = req.body.userId;
//   const QuestionId = req.body.questionId;
//   const StudentsAnswer = req.body.text;

//   //fetch http://localhost:5000/botquestions/${questionId}

//  and check if the status is "active" , if not respond "You are too late, the question is deactivated",
//  else check if the student has already submitted for the same question in BotQuestionAnswer model, if they have already participated, response "You can only submit once!"
// else submit the data to BotQuestionAnswer model with studentId, questionId , text  attributes in it.
//   try {
//     // const package = await prisma.BotQuestions.create({
//     //   data: req.body,
//     //  });
//     res.json(package);
//   } catch (error) {}
// });

//Update Student
router.patch("/:id", async (req, res, next) => {
  console.log("Requested: " + req.body);
  console.log("Req:", JSON.stringify(req.body));
  console.log("Statis Fetch: " + req.body.status);
  try {
    const { id } = req.params;

    const updatePackages = await prisma.BotQuestions.update({
      where: {
        id: id,
      },
      data: req.body,
    });

    if (req.body.status == "active") {
      const updatePackages = await prisma.BotQuestions.update({
        where: {
          id: id,
        },
        data: {
          activeAt: new Date(),
        },
      });
    }
    res.json(updatePackages);
  } catch (error) {
    console.log("Error from catch: " + error);
    next(error);
  }
});

router.get("/updatecalander/:id", async (req, res, next) => {
  console.log("Requested: " + req.body);
  try {
    const { id } = req.params;
    //  const updatePackages = await prisma.packages.update({
    //    where: {
    //     id: id,
    //   },
    //   data: req.body,
    //  });
    //  res.json(updatePackages);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deletePackages = await prisma.packages.delete({
      where: {
        id: id,
      },
    });
    res.json(deletePackages);
  } catch (error) {
    console.log("Error from catch: " + error);
    next(error);
  }
});

module.exports = router;
