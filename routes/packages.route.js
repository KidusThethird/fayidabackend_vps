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
  "/upload_package_thumbnail/:id",
  upload.single("package_image"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singlePackage = await prisma.Packages.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singlePackage) {
      if (!singlePackage.thumbnail) {
        console.log("No prior Image found!");
      } else if (
        singlePackage.thumbnail != null ||
        singlePackage.thumbnail != ""
      ) {
        olderFileName = singlePackage.thumbnail;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `package_thumbnails/${olderFileName}`;
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
    const filePath = `package_thumbnails/${fileName}`;
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

      const updatedPackage = await prisma.Packages.update({
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
        const packages = await prisma.packages.findMany({
          include: { courses: true },
        });
        res.json(packages);
      } catch (error) {
        next(error);
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get("/slider/", async (req, res, next) => {
  try {
    const packages = await prisma.packages.findMany({
      include: { courses: true },
      where: {
        status: true,
        discountStatus: true,
      },
    });
    res.json(packages);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchPackages/", async (req, res, next) => {
  try {
    const packages = await prisma.packages.findMany({
      where: {
        status: true,
      },
      include: { courses: true },
    });
    res.json(packages);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchPackagesall/", async (req, res, next) => {
  //const FolderName = req.params.folderName;
  // console.log("Folder Name Requested: " + FolderName);
  try {
    const packages = await prisma.packages.findMany({
      where: {
        status: true,
        //   group2: FolderName,
      },
      include: { courses: true },
    });

    const packagesWithSignedUrls = await Promise.all(
      packages.map(async (pac) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "package_thumbnails",
          pac.thumbnail
        );
        return { ...pac, imgUrl: signedUrlforFile };
      })
    );
    res.json(packagesWithSignedUrls);
    // res.json(packages);
  } catch (error) {
    next(error);
  }
});

router.get("/fetchPackages/:folderName", async (req, res, next) => {
  const FolderName = req.params.folderName;
  console.log("Folder Name Requested: " + FolderName);
  try {
    const packages = await prisma.packages.findMany({
      where: {
        status: true,
        group2: FolderName,
      },
      include: { courses: true },
    });

    const packagesWithSignedUrls = await Promise.all(
      packages.map(async (pac) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "package_thumbnails",
          pac.thumbnail
        );
        return { ...pac, imgUrl: signedUrlforFile };
      })
    );
    res.json(packagesWithSignedUrls);
    // res.json(packages);
  } catch (error) {
    next(error);
  }
});

router.get("/fetch_home_packages/", async (req, res, next) => {
  try {
    const packages = await prisma.packages.findMany({
      where: {
        displayOnHome: true,
        status: true,
      },
      include: { courses: true },
    });

    const packagesWithSignedUrls = await Promise.all(
      packages.map(async (pac) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "package_thumbnails",
          pac.thumbnail
        );
        return { ...pac, imgUrl: signedUrlforFile };
      })
    );
    res.json(packagesWithSignedUrls);
  } catch (error) {
    next(error);
  }
});

router.get("/filter_fetch_home_packages/:filterKey", async (req, res, next) => {
  const FilterKey = req.params.filterKey;
  console.log("FIlterKiey: " + FilterKey);
  try {
    const packages = await prisma.packages.findMany({
      where: {
        tag: FilterKey,
        status: true,
      },
      include: { courses: true },
    });

    const packagesWithSignedUrls = await Promise.all(
      packages.map(async (pac) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "package_thumbnails",
          pac.thumbnail
        );
        return { ...pac, imgUrl: signedUrlforFile };
      })
    );
    res.json(packagesWithSignedUrls);
  } catch (error) {
    next(error);
  }
});
//Get one student
// router.get("/:id", async (req, res, next) => {
//   try {
//     const { id } = req.params;
//     const singlePackage = await prisma.packages.findUnique({
//       where: {
//         id: id,
//       },
//       include: { courses: true },
//     });

//     if (singlePackage) {
//       console.log("in payment with id 2");
//       const signedUrlforFile = await generateSignedUrl(
//         "generalfilesbucket",
//         "package_thumbnails",
//         singlePackage.thumbnail
//       );
//       console.log("print of x: " + signedUrlforFile);
//       res.json({ ...singlePackage, imgUrl: signedUrlforFile });
//     }

//     //  res.json(singlePackage);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singlePackage = await prisma.packages.findUnique({
      where: {
        id: id,
      },
      include: {
        courses: {
          include: {
            CourseUnitsList: { orderBy: { UnitNumber: "asc" } },
            materials: {
              orderBy: [{ part: "asc" }, { materialIndex: "asc" }],
              include: {
                video: true,
                assementId: true,
                file: true,
                link: true,
              },
            },
          },
        },
        review: { include: { Student: true } },
      },

      // reviews: {
      //   include: {
      //     Student: true,
      //   },
      // },
    });

    if (singlePackage) {
      console.log("in payment with id 2");
      const signedUrlsForCourses = await Promise.all(
        singlePackage.courses.map(async (course) => {
          console.log("Course Vid: " + course.courseIntroductionVideo);
          const signedUrlforVideo = await generateSignedUrl(
            "generalfilesbucket",
            "course_introduction_videos",
            course.courseIntroductionVideo
          );
          return { ...course, videoUrl: signedUrlforVideo };
        })
      );

      const signedUrlforThumbnail = await generateSignedUrl(
        "generalfilesbucket",
        "package_thumbnails",
        singlePackage.thumbnail
      );

      const packageWithUrls = {
        ...singlePackage,
        courses: signedUrlsForCourses,
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
      try {
        const package = await prisma.packages.create({
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

//Update Student
router.patch("/:id", async (req, res, next) => {
  console.log("Requested: " + req.body);
  console.log("Req:", JSON.stringify(req.body));
  try {
    const { id } = req.params;
    const updatePackages = await prisma.packages.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updatePackages);
  } catch (error) {
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
    next(error);
  }
});

module.exports = router;
