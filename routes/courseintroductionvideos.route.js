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

//post request
router.post(
  "/upload_video/:id",
  upload.single("course_introduction_video"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singleCourse = await prisma.Courses.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singleCourse) {
      if (!singleCourse.courseIntroductionVideo) {
        console.log("No prior Image found!");
      } else if (
        singleCourse.courseIntroductionVideo != null ||
        singleCourse.imcourseIntroductionVideoage != ""
      ) {
        olderFileName = singleCourse.courseIntroductionVideo;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `course_introduction_videos/${olderFileName}`;
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
    const filePath = `course_introduction_videos/${fileName}`;
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

      const updateCourse = await prisma.Courses.update({
        where: {
          id: req.params.id,
        },
        data: { courseIntroductionVideo: fileName },
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

/// delete a vedio from the uploads folder
// router.delete("/deleteVideoFromUploads/:filename", (req, res) => {
//   const filename = req.params.filename;
//  console.log('Delete cource introduction video requested');

// });

router.delete(
  "deleteVideoFromUploads/:filename",
  checkAuthenticated,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.accountType == "Admin") {
        try {
          const { id } = req.params;
          deleteCourseVideo = await prisma.Courses.findUnique({
            where: {
              id: id,
            },
          });

          if (deleteCourseVideo) {
            if (!deleteCourseVideo.courseIntroductionVideo) {
              console.log("No prior Image found!");
            } else if (
              deleteCourseVideo.courseIntroductionVideo != null ||
              deleteCourseVideo.courseIntroductionVideo != ""
            ) {
              olderFileName = deleteCourseVideo.courseIntroductionVideo;
              console.log("OlderFileName: " + olderFileName);

              if (olderFileName != null || olderFileName != "") {
                const filePath = `course_introduction_videos/${olderFileName}`;
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
          res.json(deleteCourseVideo);
        } catch (error) {
          next(error);
        }
      } else {
        res.json({ Error: "You dont have access" });
      }
    } else {
      res.json({ Error: "You dont have access" });
    }
  }
);

//working with students

//Get all student
// router.get("/", async (req, res, next) => {
//   try {
//     const videos = await prisma.videos.findMany({});
//     res.json(videos);
//   } catch (error) {
//     next(error);
//   }
// });

//Get one student
// router.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const singleVideo = await prisma.videos.findUnique({
//       where: {
//         id: id,
//       },
//     });
//     res.json(singleVideo);
//   } catch (error) {
//     next(error);
//   }
// });

//Create a Student
// router.post("/", async (req, res, next) => {
//   try {
//     const video = await prisma.videos.create({
//       data: req.body,
//     });
//     res.json(video);
//   } catch (error) {}
// });

//Update Student
router.patch("/:id", async (req, res, next) => {
  console.log("Print form patch");
  try {
    const { id } = req.params;
    const updateVideo = await prisma.Courses.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updateVideo);
  } catch (error) {
    next(error);
  }
});

//delete Student
// router.delete("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     deleteVideo = await prisma.videos.delete({
//       where: {
//         id: id,
//       },
//     });
//     res.json(deleteVideo);
//   } catch (error) {
//     next(error);
//   }
// });

module.exports = router;
