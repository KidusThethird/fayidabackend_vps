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

router.post(
  "/upload_file/:id",
  upload.single("course_material"),
  async (req, res) => {
    console.log("Id from post: " + req.params.id);
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singleVideo = await prisma.MaterialFile.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singleVideo) {
      if (!singleVideo.location) {
        console.log("No prior Image found!");
      } else if (singleVideo.location != null || singleVideo.location != "") {
        olderFileName = singleVideo.location;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `common_files/${olderFileName}`;
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
    const filePath = `common_files/${fileName}`;
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
      try {
        const updateVideo = await prisma.MaterialFile.update({
          where: {
            id: req.params.id,
          },
          data: { location: fileName },
        });
        //   res.json(updatePaymentMethod);

        res.status(201).json({
          message: "File uploaded successfully!",
          fileName: file.originalname,
        });
      } catch (err) {
        console.log("Error from catch: " + err);
      }
    });

    blobStream.end(file.buffer);
  }
);

router.get("/upload_file", async (req, res, next) => {
  //res.send({ message: "Awesome it works" });
  const filePath = path.join(__dirname, "../views", "index.html");
  res.sendFile(filePath);
});

/// delete a vedio from the uploads folder
router.delete(
  "/deleteFileFromUploads/:filename/:id",
  checkAuthenticated,
  async (req, res) => {
    if (req.isAuthenticated()) {
      if (req.user.accountType == "Admin") {
        try {
          const { id } = req.params;
          console.log("Id get: " + req.params.id);
          console.log("FileName from params: " + req.params.filename);
          deleteVideo = await prisma.MaterialFile.delete({
            where: {
              id: id,
            },
          });

          if (deleteVideo) {
            if (!deleteVideo.location) {
              console.log("No prior File found!");
            } else if (
              deleteVideo.location != null ||
              deleteVideo.location != ""
            ) {
              olderFileName = deleteVideo.location;
              console.log("OlderFileName: " + olderFileName);

              if (olderFileName != null || olderFileName != "") {
                const filePath = `common_files/${olderFileName}`;
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
          res.json(deleteVideo);
        } catch (error) {
          console.log("Error from catch: " + error);
          //next(error);
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
router.get("/", async (req, res, next) => {
  try {
    const videos = await prisma.MaterialFile.findMany({});
    res.json(videos);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleVideo = await prisma.MaterialFile.findUnique({
      where: {
        id: id,
      },
    });

    if (singleVideo) {
      console.log("in payment with id 2");
      const signedUrlforFile = await generateSignedUrl(
        "generalfilesbucket",
        "common_files",
        singleVideo.location
      );
      console.log("print of x: " + signedUrlforFile);
      res.json({ ...singleVideo, fileUrl: signedUrlforFile });
    }
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const video = await prisma.MaterialFile.create({
      data: req.body,
    });
    res.json(video);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateVideo = await prisma.MaterialFile.update({
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
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deleteVideo = await prisma.MaterialFile.delete({
      where: {
        id: id,
      },
    });
    res.json(deleteVideo);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
