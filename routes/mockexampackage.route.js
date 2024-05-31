const router = require("express").Router();
//add this
const express = require("express");
const { Storage } = require("@google-cloud/storage");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

const { PrismaClient } = require("@prisma/client");
const multer = require("multer");

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
  "/upload_package_thumbnail/:id",
  upload.single("package_image"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singleMockPakcage = await prisma.MockPackage.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singleMockPakcage) {
      if (!singleMockPakcage.thumbnail) {
        console.log("No prior Image found!");
      } else if (
        singleMockPakcage.thumbnail != null ||
        singleMockPakcage.thumbnail != ""
      ) {
        olderFileName = singleMockPakcage.thumbnail;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `mock_package_thumbnails/${olderFileName}`;
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
    const filePath = `mock_package_thumbnails/${fileName}`;
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

      const updateMockPackage = await prisma.MockPackage.update({
        where: {
          id: req.params.id,
        },
        data: { thumbnail: fileName },
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

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const Mock = await prisma.MockPackage.findMany({
      include: { Exams: true },
    });
    res.json(Mock);
  } catch (error) {
    console.log("Error from catch: " + error);
    next(error);
  }
});

// router.get("/tostudent/", async (req, res, next) => {
//   try {
//     const Mock = await prisma.MockPackage.findMany({
//       include: { Exams: true },
//       where: {
//         status: "active",
//       },
//       orderBy: { price: "asc" },
//     });
//     if (Mock) {
//       console.log("in payment with id 2");
//       const signedUrlforFile = await generateSignedUrl(
//         "generalfilesbucket",
//         "mock_package_thumbnails",
//         Mock.thumbnail
//       );

//       console.log("print of x: " + signedUrlforFile);
//       res.json({ ...Mock, imgUrl: signedUrlforFile });
//     }
//     //  res.json(Mock);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/tostudent/", async (req, res, next) => {
  try {
    const mocks = await prisma.MockPackage.findMany({
      include: { Exams: true },
      where: {
        status: "active",
      },
      orderBy: { price: "asc" },
    });

    const mocksWithSignedUrls = await Promise.all(
      mocks.map(async (mock) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "mock_package_thumbnails",
          mock.thumbnail
        );
        return { ...mock, imgUrl: signedUrlforFile };
      })
    );

    res.json(mocksWithSignedUrls);
  } catch (error) {
    next(error);
  }
});

//get pakcages firectly form sub folder
router.get("/tostudentselect/:foldername", async (req, res, next) => {
  const FolderName = req.params.foldername;
  console.log("Folder Name: " + FolderName);
  try {
    const Mock = await prisma.MockPackage.findMany({
      include: { Exams: true },
      where: {
        status: "active",
        group2: FolderName,
      },
      orderBy: { createdAt: "asc" },
    });
    const mocksWithSignedUrls = await Promise.all(
      Mock.map(async (mock) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "mock_package_thumbnails",
          mock.thumbnail
        );
        return { ...mock, imgUrl: signedUrlforFile };
      })
    );

    res.json(mocksWithSignedUrls);
  } catch (error) {
    next(error);
  }
});

//get pakcages firectly form main folder
router.get("/tostudentselectmain/:foldername", async (req, res, next) => {
  const FolderName = req.params.foldername;
  console.log("Folder Name: " + FolderName);
  try {
    const Mock = await prisma.MockPackage.findMany({
      include: { Exams: true },
      where: {
        status: "active",
        group: FolderName,
      },
      orderBy: { createdAt: "asc" },
    });
    const mocksWithSignedUrls = await Promise.all(
      Mock.map(async (mock) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "mock_package_thumbnails",
          mock.thumbnail
        );
        return { ...mock, imgUrl: signedUrlforFile };
      })
    );

    res.json(mocksWithSignedUrls);
  } catch (error) {
    next(error);
  }
});

router.get("/checkphonenumber/:phonenumber", async (req, res, next) => {
  try {
    const Mock = await prisma.MockPackage.findMany({
      include: { Exams: true },
      where: {
        status: "active",
      },
      orderBy: { price: "asc" },
    });
    res.json(Mock);
  } catch (error) {
    next(error);
  }
});

//Get one student
// router.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params.id;
//     console.log("rec: " + req.params.id);
//     const Mock = await prisma.MockPackage.findUnique({
//       where: {
//         id: req.params.id,
//       },
//       include: { Exams: true },
//     });
//     res.json(Mock);
//   } catch (error) {
//     console.log("error form catch: " + error);
//     next(error);
//   }
// });

router.get("/:id", async (req, res, next) => {
  console.log("in payment with id 1");
  try {
    const { id } = req.params;

    const Mock = await prisma.MockPackage.findUnique({
      where: {
        id: req.params.id,
      },
      include: { Exams: true },
    });

    if (Mock) {
      console.log("in payment with id 2");
      const signedUrlforFile = await generateSignedUrl(
        "generalfilesbucket",
        "mock_package_thumbnails",
        Mock.thumbnail
      );

      console.log("print of x: " + signedUrlforFile);
      res.json({ ...Mock, imgUrl: signedUrlforFile });
    }
  } catch (error) {
    console.log("Error from catch: " + error);
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  // console.log("Req: " + req.body.cityName);
  console.log("Req:", JSON.stringify(req.body));

  try {
    const Mock = await prisma.MockPackage.create({
      data: req.body,
    });
    res.json(Mock);
  } catch (error) {
    console.log("Error from catch: " + error);
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  console.log("Req:", JSON.stringify(req.body));
  console.log("PackageId: " + req.params.id);
  // if (req.isAuthenticated()) {
  // if (req.user.accountType == "Admin") {
  try {
    const { id } = req.params;
    const Mock = await prisma.MockPackage.update({
      where: {
        id: req.params.id,
      },
      data: req.body,
    });
    res.json(Mock);
  } catch (error) {
    console.log("error from catch: " + error);
    next(error);
  }
  // } else {
  //   res.json({ Error: "You dont have access" });
  // }
  // } else {
  //   res.json({ Error: "You dont have access" });
  // }
});

//delete Student
router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        Mock = await prisma.MockPackage.delete({
          where: {
            id: req.params.id,
          },
        });

        res.json(Mock);
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
