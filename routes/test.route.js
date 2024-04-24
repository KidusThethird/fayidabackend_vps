const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const multer = require("multer");
const path = require("path");
const http = require("http");

const prisma = new PrismaClient();
var fileNameSaved = "";
//image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload_assets/images/blog_images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    fileNameSaved = (
      "" +
      Date.now() +
      path.extname(file.originalname)
    ).toString();
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/upload_blog_image", async (req, res, next) => {
  //res.send({ message: "Awesome it works" });
  const filePath = path.join(__dirname, "../views", "index.html");
  res.sendFile(filePath);
});

//router.post(
// "/upload_package_thumbnail",
// upload.single("package_image"),
// (req, res) => {
//   res.send(`image Uploaded: ${fileNameSaved}`);
// }
//);

router.post(
  "/upload_blog_image/:id",
  upload.single("blog_image"),
  (req, res) => {
    // ... file upload logic ...

    // Assuming `fileNameSaved` contains the saved file name
    const blogId = req.params.id; // Assuming the package ID is available in the request parameters

    const options = {
      hostname: "localhost",
      port: 5000, // Replace with the appropriate port number
      path: `/blogs/${blogId}`,
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const request = http.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        // Handle the response after the PATCH request is complete
        if (response.statusCode === 200) {
          res.send(`Image Uploaded: ${fileNameSaved}`);
        } else {
          res.status(500).send("Failed to update Blog attribute");
        }
      });
    });

    request.on("error", (error) => {
      // Handle the PATCH request error
      res.status(500).send("Failed to update blog attribute 2");
    });

    const payload = JSON.stringify({ thumbnail: fileNameSaved });

    request.write(payload);
    request.end();
  }
);
//patch package image to an existing package
//router.patch("/upload_package_thumbnail/:id", async (req, res, next) => {
// try {
//  const { id } = req.params;
//  const updatePackages = await prisma.packages.update({
//    where: {
//      id: id,
//    },
//    data: { thumbnail: fileNameSaved },
//  });
//  res.json(updatePackages);
//} catch (error) {
//  next(error);
// }
//});

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const packages = await prisma.packages.findMany({
      include: { courses: true },
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
//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singlePackage = await prisma.packages.findUnique({
      where: {
        id: id,
      },
      include: { courses: true },
    });
    res.json(singlePackage);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const package = await prisma.packages.create({
      data: req.body,
    });
    res.json(package);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
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
