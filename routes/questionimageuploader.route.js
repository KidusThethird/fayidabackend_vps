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

// //post request
// router.post(
//   "/upload_question_image/:id",
//   upload.single("question_Image"),
//   async (req, res) => {
//     const file = req.file;
//     try {
//       if (!file) {
//         res.status(400).send("No file uploaded");
//       }

//       //delete the former image
//       let olderFileName = "";
//       const singleQuestion = await prisma.Questions.findUnique({
//         where: {
//           id: req.params.id,
//         },
//       });
//       console.log("Single question: "+ JSON.stringify(singleQuestion))
//       if (singleQuestion) {
//         if (!singleQuestion.questionImage) {
//           console.log("No prior Image found!");
//         } else if (
//           singleQuestion.questionImage != null ||
//           singleQuestion.questionImage != ""
//         ) {
//           olderFileName = singleQuestion.questionImage;
//           console.log("OlderFileName: " + olderFileName);

//           if (olderFileName != null || olderFileName != "") {
//             const filePath = `question_images/${olderFileName}`;
//             //const blob = bucket.file(filePath);
//             try {
//               await bucket.file(filePath).delete();
//               console.log("Older File Deleted");
//             } catch (error) {
//               console.log("Error: " + error);
//             }
//           }
//         } else {
//           console.log("New file");
//         }
//       }

//       const fileName = Date.now() + "-" + file.originalname;
//       const filePath = `question_images/${fileName}`;
//       // convert to a blob

//       const blob = bucket.file(filePath);
//       const blobStream = blob.createWriteStream({
//         metadata: {
//           contentType: file.mimetype,
//         },
//       });
//       blobStream.on("error", (err) => {
//         res.status(500).send(err);
//       });
//       blobStream.on("finish", async () => {
//         console.log("Blob Finished!");
//         console.log("FIle Name: " + fileName);
//         console.log("Id: " + req.params.id);

//         const updateQuestionImage = await prisma.Questions.update({
//           where: {
//             id: req.params.id,
//           },
//           data: { questionImage: fileName },
//         });
//         //   res.json(updatePaymentMethod);

//         res.status(201).json({
//           message: "File uploaded successfully!",
//           fileName: file.originalname,
//         });
//       });
//     } catch (error) {
//       console.log("Error from catch: " + error);
//     }
//     try {
//       blobStream.end(file.buffer);
//     } catch (err) {
//       console.log("Error from catch: " + err);
//     }
//   }
// );

// router.post(
//   "/upload_question_image/:id",
//   upload.single("question_Image"),
//   async (req, res) => {

router.post("/upload_question_image/:id", (req, res, next) => {
  upload.single(req.params.id)(req, res, async (err) => {
    if (err) {
      // Handle the error
      return;
    }
    console.log("You are in me!");
    console.log("Id: " + req.params.id);
    const file = req.file;
    try {
      if (!file) {
        console.log("No file detected");
        return res.status(400).send("No file uploaded");
      }

      // Delete the former image
      let olderFileName = "";
      const singleQuestion = await prisma.Questions.findUnique({
        where: {
          id: req.params.id,
        },
      });

      //console.log("SingleQuestion: " + JSON.stringify(singleQuestion));
      console.log("Single question: " + JSON.stringify(singleQuestion));
      if (singleQuestion) {
        if (singleQuestion.questionImage) {
          olderFileName = singleQuestion.questionImage;
          console.log("OlderFileName: " + olderFileName);

          if (olderFileName) {
            const filePath = `question_images/${olderFileName}`;
            try {
              await bucket.file(filePath).delete();
              console.log("Older File Deleted");
            } catch (error) {
              console.log("Error: " + error);
            }
          }
        } else {
          console.log("No prior Image found!");
        }
      }

      const fileName = Date.now() + "-" + file.originalname;
      const filePath = `question_images/${fileName}`;

      // Convert to a blob
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
        console.log("File Name: " + fileName);
        console.log("Id: " + req.params.id);
        try {
          const updateQuestionImage = await prisma.Questions.update({
            where: {
              id: req.params.id,
            },
            data: { questionImage: fileName },
          });

          res.status(201).json({
            message: "File uploaded successfully!",
            fileName: file.originalname,
          });
        } catch (err) {
          console.log("Error form catch: " + err);
        }
      });

      blobStream.end(file.buffer); // Move this line inside the try block
    } catch (error) {
      console.log("Error from catch: " + error);
      res.status(500).send("Error uploading file");
    }
  });
});

//router.post(
// "/upload_package_thumbnail",
// upload.single("package_image"),
// (req, res) => {
//   res.send(`image Uploaded: ${fileNameSaved}`);
// }
//);

router.post("/upload_correction_image/:id", (req, res, next) => {
  upload.single("x" + req.params.id)(req, res, async (err) => {
    if (err) {
      // Handle the error
      return;
    }
    console.log("You are in me too!");
    console.log("Id: " + req.params.id);
    const file = req.file;
    try {
      if (!file) {
        console.log("No file detected");
        return res.status(400).send("No file uploaded");
      }

      // Delete the former image
      let olderFileName = "";
      const singleQuestion = await prisma.Questions.findUnique({
        where: {
          id: req.params.id,
        },
      });

      //console.log("SingleQuestion: " + JSON.stringify(singleQuestion));
      console.log("Single question: " + JSON.stringify(singleQuestion));
      if (singleQuestion) {
        if (singleQuestion.correctionImage) {
          olderFileName = singleQuestion.correctionImage;
          console.log("OlderFileName: " + olderFileName);

          if (olderFileName) {
            const filePath = `question_images/${olderFileName}`;
            try {
              await bucket.file(filePath).delete();
              console.log("Older File Deleted");
            } catch (error) {
              console.log("Error: " + error);
            }
          }
        } else {
          console.log("No prior Image found!");
        }
      }

      const fileName = Date.now() + "-" + file.originalname;
      const filePath = `question_images/${fileName}`;

      // Convert to a blob
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
        console.log("File Name: " + fileName);
        console.log("Id: " + req.params.id);
        try {
          const updateQuestionImage = await prisma.Questions.update({
            where: {
              id: req.params.id,
            },
            data: { correctionImage: fileName },
          });

          res.status(201).json({
            message: "File uploaded successfully!",
            fileName: file.originalname,
          });
        } catch (err) {
          console.log("Error form catch: " + err);
        }
      });

      blobStream.end(file.buffer); // Move this line inside the try block
    } catch (error) {
      console.log("Error from catch: " + error);
      res.status(500).send("Error uploading file");
    }
  });
});

// File upload logic

// router.post("/upload_correction_image/:id", (req, res, next) => {
//   upload.single(req.params.id)(req, res, async (err) => {
//     if (err) {
//       // Handle the error
//       return;
//     }

//     // File upload logic

//     const questionId = req.params.id;
//     console.log("Question Id: " + questionId);
//     console.log("RandomNumber2: " + RandomNumberFullForm);

//     const Mock = await prisma.Questions.update({
//       where: {
//         id: questionId,
//       },
//       data: { correctionImage: RandomNumberFullForm },
//     });

//     // ... continue with the rest of the code ...
//   });
// });

{
  /*********************************************************** */
}
{
  /*********************************************************** */
}
{
  /*********************************************************** */
}
{
  /*********************************************************** */
}

module.exports = router;
