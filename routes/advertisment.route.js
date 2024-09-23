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
  "/upload_advertisment_images/:id",
  upload.single("advertisment_images"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singleAdvertisment = await prisma.Advertisement.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singleAdvertisment) {
      if (!singleAdvertisment.image) {
        console.log("No prior Image found!");
      } else if (
        singleAdvertisment.image != null ||
        singleAdvertisment.image != ""
      ) {
        olderFileName = singleAdvertisment.image;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `advertisement_images/${olderFileName}`;
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
    const filePath = `advertisement_images/${fileName}`;
    // convert to a blob

    const blob = bucket.file(filePath);
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });
    blobStream.on("error", (err) => {
      console.log("Erro: " + err);
      res.status(500).send(err);
    });
    blobStream.on("finish", async () => {
      console.log("Blob Finished!");
      console.log("FIle Name: " + fileName);
      console.log("Id: " + req.params.id);
      try {
        const updateAdvertisiment = await prisma.Advertisement.update({
          where: {
            id: req.params.id,
          },
          data: { image: fileName },
        });
      } catch (error) {
        console.log("Errror form catch: " + error);
      }
      //   res.json(updatePaymentMethod);

      res.status(201).json({
        message: "File uploaded successfully!",
        fileName: file.originalname,
      });
    });

    blobStream.end(file.buffer);
  }
);
//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const advertisment = await prisma.Advertisement.findMany({
      orderBy: {
        advertisementIndex: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });
    res.json(advertisment);
  } catch (error) {
    next(error);
  }
});
router.get("/displayhome/", async (req, res, next) => {
  try {
    const advertisment = await prisma.Advertisement.findMany({
      where: {
        displayOnHome: "true",
      },
      orderBy: {
        advertisementIndex: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });

    const AdWithSignedUrls = await Promise.all(
      advertisment.map(async (ad) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "advertisement_images",
          ad.image
        );
        return { ...ad, imgUrl: signedUrlforFile };
      })
    );

    res.json(AdWithSignedUrls);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const advertisment = await prisma.Advertisement.findUnique({
      where: {
        id: id,
      },
    });
    if (advertisment) {
      console.log("in payment with id 2");
      const signedUrlforFile = await generateSignedUrl(
        "generalfilesbucket",
        "advertisement_images",
        advertisment.image
      );
      console.log("print of x: " + signedUrlforFile);
      res.json({ ...advertisment, imgUrl: signedUrlforFile });
    }
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "min") {
      try {
        const advertisment = await prisma.Advertisement.create({
          data: req.body,
        });
        res.json(advertisment);
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
  try {
    const { id } = req.params;
    const advertisment = await prisma.Advertisement.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(advertisment);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        deleteAdvertisment = await prisma.Advertisement.delete({
          where: {
            id: id,
          },
        });

        if (deleteAdvertisment) {
          if (!deleteAdvertisment.image) {
            console.log("No prior Image found!");
          } else if (
            deleteAdvertisment.image != null ||
            deleteAdvertisment.image != ""
          ) {
            olderFileName = deleteAdvertisment.image;
            console.log("OlderFileName: " + olderFileName);

            if (olderFileName != null || olderFileName != "") {
              const filePath = `advertisement_images/${olderFileName}`;
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
        res.json(deleteAdvertisment);
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
