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

router.use(
  cors({
    origin: ["https://fayidaacademy.com", "https://admin.fayidaacademy.com"],
  })
);

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
  "/upload_blog_images/:id",
  upload.single("blog_image"),
  async (req, res) => {
    const file = req.file;
    if (!file) {
      res.status(400).send("No file uploaded");
    }

    //delete the former image
    let olderFileName = "";
    const singleBlog = await prisma.Blogs.findUnique({
      where: {
        id: req.params.id,
      },
    });
    if (singleBlog) {
      if (!singleBlog.image) {
        console.log("No prior Image found!");
      } else if (singleBlog.image != null || singleBlog.image != "") {
        olderFileName = singleBlog.image;
        console.log("OlderFileName: " + olderFileName);

        if (olderFileName != null || olderFileName != "") {
          const filePath = `blog_images/${olderFileName}`;
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
    const filePath = `blog_images/${fileName}`;
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

      const updateBlogs = await prisma.Blogs.update({
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
  /******************

***************************************
********************************** 

**************************************/
}

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const blogs = await prisma.blogs.findMany({
      orderBy: {
        blogIndex: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});
router.get("/displayhome/", async (req, res, next) => {
  try {
    const blogs = await prisma.blogs.findMany({
      where: {
        displayOnHome: "true",
      },
      orderBy: {
        blogIndex: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });

    const blogWithSignedUrls = await Promise.all(
      blogs.map(async (blog) => {
        const signedUrlforFile = await generateSignedUrl(
          "generalfilesbucket",
          "blog_images",
          blog.image
        );
        return { ...blog, imgUrl: signedUrlforFile };
      })
    );

    res.json(blogWithSignedUrls);
    //  res.json(blogs);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleBlog = await prisma.blogs.findUnique({
      where: {
        id: id,
      },
    });

    if (singleBlog) {
      console.log("in payment with id 2");
      const signedUrlforFile = await generateSignedUrl(
        "generalfilesbucket",
        "blog_images",
        singleBlog.image
      );
      console.log("print of x: " + signedUrlforFile);
      res.json({ ...singleBlog, imgUrl: signedUrlforFile });
    }

    //res.json(singleBlog);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const blog = await prisma.blogs.create({
          data: req.body,
        });
        res.json(blog);
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
    const updateBlog = await prisma.blogs.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updateBlog);
  } catch (error) {
    next(error);
  }
});

//delete Student

router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        deleteBlog = await prisma.Blogs.delete({
          where: {
            id: id,
          },
        });

        if (deleteBlog) {
          if (!deleteBlog.image) {
            console.log("No prior Image found!");
          } else if (deleteBlog.image != null || deleteBlog.image != "") {
            olderFileName = deleteBlog.image;
            console.log("OlderFileName: " + olderFileName);

            if (olderFileName != null || olderFileName != "") {
              const filePath = `blog_images/${olderFileName}`;
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
        res.json(deleteBlog);
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
