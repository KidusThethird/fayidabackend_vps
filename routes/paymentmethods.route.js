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
  "/upload_paymentmethod_image/:id",
  upload.single("paymentmethod_image"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singlepaymentmethods = await prisma.PaymentMethods.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singlepaymentmethods) {
      if (!singlepaymentmethods.image) {
        console.log("No prior Image found!");
      } else if (
        singlepaymentmethods.image != null ||
        singlepaymentmethods.image != ""
      ) {
        olderFileName = singlepaymentmethods.image;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `paymentmethod_images/${olderFileName}`;
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
    const filePath = `paymentmethod_images/${fileName}`;
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

      const updatePaymentMethod = await prisma.PaymentMethods.update({
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
  /*************************************************************** */
}
{
  /*************************************************************** */
}
{
  /*************************************************************** */
}

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const paymentMethods = await prisma.PaymentMethods.findMany({});
    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  console.log("in payment with id 1");
  try {
    const { id } = req.params;

    const singlepaymentmethods = await prisma.PaymentMethods.findUnique({
      where: {
        id: id,
      },
    });
    /////////////////
    if (singlepaymentmethods) {
      console.log("in payment with id 2");
      const signedUrlforFile = await generateSignedUrl(
        "generalfilesbucket",
        "paymentmethod_images",
        singlepaymentmethods.image
      );
      console.log("print of x: " + signedUrlforFile);
      res.json({ ...singlepaymentmethods, imgUrl: signedUrlforFile });
    }

    //////////////
  } catch (error) {
    console.log("Error from catch: " + error);
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const paymentMethods = await prisma.PaymentMethods.create({
      data: req.body,
    });
    res.json(paymentMethods);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatePaymentMethod = await prisma.PaymentMethods.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updatePaymentMethod);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deletePaymentMethod = await prisma.PaymentMethods.delete({
      where: {
        id: id,
      },
    });
    res.json(deletePaymentMethod);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
