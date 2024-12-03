const router = require("express").Router();
//add this
const express = require("express");
const { Storage } = require("@google-cloud/storage");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const authenticateToken = require("./authMiddleware");

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
  "/upload_prize_images/:id",
  upload.single("prize_image"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singlePrize = await prisma.Prize.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singlePrize) {
      if (!singlePrize.image) {
        console.log("No prior Image found!");
      } else if (singlePrize.image != null || singlePrize.image != "") {
        olderFileName = singlePrize.image;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `prize_images/${olderFileName}`;
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
    const filePath = `prize_images/${fileName}`;
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
        const updatePaymentMethod = await prisma.Prize.update({
          where: {
            id: req.params.id,
          },
          data: { image: fileName },
        });
      } catch (error) {
        console.log("Error from catch: " + error);
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

{
  /**************************************

****************************************
**************************************
*****************************

*******************/
}

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const prizes = await prisma.Prize.findMany({
      orderBy: {
        points: "desc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });
    res.json(prizes);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchprizes/", async (req, res, next) => {
  try {
    const prizes = await prisma.Prize.findMany({
      orderBy: {
        points: "desc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
      where: {
        visiblity: "active",
      },
    });
    const prizeWithSignedUrls = await Promise.all(
      prizes.map(async (p) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "prize_images",
          p.image
        );
        return { ...p, imgUrl: signedUrlforFile };
      })
    );

    res.json(prizeWithSignedUrls);
    // res.json(prizes);
  } catch (error) {
    next(error);
  }
});
router.get("/displayhome/", async (req, res, next) => {
  try {
    const prize = await prisma.Prize.findMany({
      where: {
        prizes: "1",
      },
      orderBy: {
        prizeIndex: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });
    const prizeWithSignedUrls = await Promise.all(
      prize.map(async (p) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "prize_images",
          p.thumbnail
        );
        return { ...p, imgUrl: signedUrlforFile };
      })
    );

    res.json(prizeWithSignedUrls);
    //   res.json(prize);
  } catch (error) {
    next(error);
  }
});

router.get("/checkpoints/", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    const UserDetails = await prisma.Students.findUnique({
 
      where: { id: req.user.id },
     
    });


    const userPoints = parseInt(UserDetails.points);
    try {
      const prize = await prisma.Prize.findMany({
        orderBy: {
          points: "desc", // Replace 'asc' with 'desc' if you want to sort in descending order
        },
        where: {
          visiblity: "active",
        },
      });
      const filteredPrize = prize.filter((item) => {
        const points = parseFloat(item.points);
        return points <= parseFloat(userPoints);
      });

      console.log("points: " + req.user.points);
      const prizeWithSignedUrls = await Promise.all(
        prize.map(async (p) => {
          const signedUrlforFile = await generateSignedUrl(
            "generalfilesbucket",
            "prize_images",
            p.image
          );
          return { ...p, imgUrl: signedUrlforFile };
        })
      );

      res.json(prizeWithSignedUrls);
    } catch (error) {
      next(error);
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const prize = await prisma.Prize.findUnique({
      where: {
        id: id,
      },
    });
    if (prize) {
      console.log("in payment with id 2");
      const signedUrlforFile = await generateSignedUrl(
        "generalfilesbucket",
        "prize_images",
        prize.image
      );
      console.log("print of x: " + signedUrlforFile);
      res.json({ ...prize, imgUrl: signedUrlforFile });
    }
    // res.json(prize);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", authenticateToken, async (req, res, next) => {
  console.log("Print one");
  if (req.user.id) {

    const UserDetails = await prisma.Students.findUnique({
 
      where: { id: req.user.id },
     
    });

    console.log("Print two");
    if (UserDetails.accountType == "Admin") {
      console.log("Print three");
      try {
        const prize = await prisma.Prize.create({
          data: req.body,
        });
        res.json(prize);
      } catch (error) {
        console.log("Error from catch: " + error);
      }
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//Update Student
router.patch("/:id", authenticateToken, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatePrize = await prisma.Prize.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updatePrize);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", authenticateToken, async (req, res, next) => {
  if (req.user.id) {

    const UserDetails = await prisma.Students.findUnique({
 
      where: { id: req.user.id },
     
    });
    if (UserDetails.accountType == "Admin") {
      try {
        const { id } = req.params;
        deletePrize = await prisma.Prize.delete({
          where: {
            id: id,
          },
        });

        if (deletePrize) {
          if (!deletePrize.image) {
            console.log("No prior Image found!");
          } else if (deletePrize.image != null || deletePrize.image != "") {
            olderFileName = deletePrize.image;
            console.log("OlderFileName: " + olderFileName);

            if (olderFileName != null || olderFileName != "") {
              const filePath = `prize_images/${olderFileName}`;
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
        res.json(deletePrize);
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
