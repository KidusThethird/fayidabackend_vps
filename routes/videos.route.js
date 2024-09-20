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

router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Use CORS middleware with options
router.use(
  cors({
    origin: "*", // Allow this origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
  })
);

//res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

// router.use(
//   cors({
//     origin: "*",
//     methods: ["xhr"],
//   })
// );

var fileNameSaved = "";
var ProgressPercent = 0;

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
  "/upload_video/:id",
  upload.single("course_video"),
  async (req, res) => {
    console.log("Upload function started");
    console.log("Id from post: " + req.params.id);

    const file = req.file;
    if (!file) {
      return res.status(400).send("No file uploaded");
    }

    // Delete the former video if it exists
    let olderFileName = "";
    const singleVideo = await prisma.Videos.findUnique({
      where: {
        id: req.params.id,
      },
    });

    if (singleVideo) {
      if (singleVideo.location) {
        olderFileName = singleVideo.location;
        console.log("OlderFileName: " + olderFileName);

        const filePath = `course_videos/${olderFileName}`;
        try {
          await bucket.file(filePath).delete();
          console.log("Older File Deleted");
        } catch (error) {
          console.error("Error deleting older file: " + error);
        }
      } else {
        console.log("No prior video found.");
      }
    }

    const fileName = Date.now() + "-" + file.originalname;
    const filePath = `course_videos/${fileName}`;
    const blob = bucket.file(filePath);

    const fileSize = file.size; // Get the total file size
    let uploadedBytes = 0;

    // Create a writable stream
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
      resumable: false,
    });

    // Track the progress by writing buffer in chunks
    const CHUNK_SIZE = 1024 * 256; // 256 KB chunk size
    const buffer = file.buffer;

    function uploadChunk(start) {
      const end = Math.min(start + CHUNK_SIZE, buffer.length);
      const chunk = buffer.slice(start, end);

      blobStream.write(chunk, () => {
        uploadedBytes += chunk.length;
        const progress = Math.round((uploadedBytes / fileSize) * 100);
        console.log(`Upload progress: ${progress}%`);
        ProgressPercent = progress;

        // Send progress to the client
        const sse = res.locals.sse;
        if (sse) {
          sse.write(`data: ${progress}\n\n`);
        }

        // If we haven't finished, keep uploading
        if (end < buffer.length) {
          uploadChunk(end);
        } else {
          blobStream.end(); // End the stream when the last chunk is written
        }
      });
    }

    blobStream.on("error", (err) => {
      console.error("Blob Stream Error:", err);
      return res.status(500).send(err.message);
    });

    blobStream.on("finish", async () => {
      console.log("Blob Finished!");
      try {
        await prisma.Videos.update({
          where: {
            id: req.params.id,
          },
          data: { location: fileName },
        });
        res.status(201).json({
          message: "File uploaded successfully!",
          fileName: file.originalname,
        });
      } catch (err) {
        console.error("Error updating video record:", err);
        res.status(500).send("Failed to update video record.");
      }
    });

    // Start uploading in chunks
    uploadChunk(0);
  }
);

router.get("/progressvalue", async (req, res, next) => {
  try {
    //const videos = await prisma.videos.findMany({});
    res.json({ progress: ProgressPercent });
  } catch (error) {
    next(error);
  }
});

//this one works with uploading percent
// router.post(
//   "/upload_video/:id",
//   upload.single("course_video"),
//   async (req, res) => {
//     console.log("Id from post: " + req.params.id);

//     const file = req.file;
//     if (!file) {
//       return res.status(400).send("No file uploaded");
//     }

//     // Delete the former video if it exists
//     let olderFileName = "";
//     const singleVideo = await prisma.Videos.findUnique({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (singleVideo) {
//       if (singleVideo.location) {
//         olderFileName = singleVideo.location;
//         console.log("OlderFileName: " + olderFileName);

//         const filePath = `course_videos/${olderFileName}`;
//         try {
//           await bucket.file(filePath).delete();
//           console.log("Older File Deleted");
//         } catch (error) {
//           console.error("Error deleting older file: " + error);
//         }
//       } else {
//         console.log("No prior video found.");
//       }
//     }

//     const fileName = Date.now() + "-" + file.originalname;
//     const filePath = `course_videos/${fileName}`;
//     const blob = bucket.file(filePath);

//     const fileSize = file.size; // Get the total file size
//     let uploadedBytes = 0;

//     // Create a writable stream
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//       },
//       resumable: false, // Disable resumable to make tracking easier
//     });

//     // Track the progress by writing buffer in chunks
//     const CHUNK_SIZE = 1024 * 256; // 256 KB chunk size
//     const buffer = file.buffer;

//     function uploadChunk(start) {
//       const end = Math.min(start + CHUNK_SIZE, buffer.length);
//       const chunk = buffer.slice(start, end);

//       blobStream.write(chunk, () => {
//         uploadedBytes += chunk.length;
//         const progress = Math.round((uploadedBytes / fileSize) * 100);
//         console.log(`Upload progress: ${progress}%`);

//         // If we haven't finished, keep uploading
//         if (end < buffer.length) {
//           uploadChunk(end);
//         } else {
//           blobStream.end(); // End the stream when the last chunk is written
//         }
//       });
//     }

//     blobStream.on("error", (err) => {
//       console.error("Blob Stream Error:", err);
//       return res.status(500).send(err.message);
//     });

//     blobStream.on("finish", async () => {
//       console.log("Blob Finished!");
//       try {
//         await prisma.Videos.update({
//           where: {
//             id: req.params.id,
//           },
//           data: { location: fileName },
//         });
//         res.status(201).json({
//           message: "File uploaded successfully!",
//           fileName: file.originalname,
//         });
//       } catch (err) {
//         console.error("Error updating video record:", err);
//         res.status(500).send("Failed to update video record.");
//       }
//     });

//     // Start uploading in chunks
//     uploadChunk(0);
//   }
// );

// router.post(
//   "/upload_video/:id",
//   upload.single("course_video"),
//   async (req, res) => {
//     console.log("Id from post: " + req.params.id);

//     const file = req.file;
//     if (!file) {
//       return res.status(400).send("No file uploaded");
//     }

//     // Delete the former video if it exists
//     let olderFileName = "";
//     const singleVideo = await prisma.Videos.findUnique({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (singleVideo) {
//       if (singleVideo.location) {
//         olderFileName = singleVideo.location;
//         console.log("OlderFileName: " + olderFileName);

//         const filePath = `course_videos/${olderFileName}`;
//         try {
//           await bucket.file(filePath).delete();
//           console.log("Older File Deleted");
//         } catch (error) {
//           console.error("Error deleting older file: " + error);
//         }
//       } else {
//         console.log("No prior video found.");
//       }
//     }

//     const fileName = Date.now() + "-" + file.originalname;
//     const filePath = `course_videos/${fileName}`;
//     const blob = bucket.file(filePath);

//     const fileSize = file.size; // Get the file size to track progress
//     let uploadedBytes = 0;

//     // Create a writable stream
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });

//     // Track progress by intercepting the data events
//     blobStream.on("data", (chunk) => {
//       uploadedBytes += chunk.length;
//       const progress = Math.round((uploadedBytes / fileSize) * 100);
//       console.log(`Upload progress: ${progress}%`);
//     });

//     blobStream.on("error", (err) => {
//       console.error("Blob Stream Error:", err);
//       return res.status(500).send(err.message);
//     });

//     blobStream.on("finish", async () => {
//       console.log("Blob Finished!");
//       try {
//         await prisma.Videos.update({
//           where: {
//             id: req.params.id,
//           },
//           data: { location: fileName },
//         });
//         res.status(201).json({
//           message: "File uploaded successfully!",
//           fileName: file.originalname,
//         });
//       } catch (err) {
//         console.error("Error updating video record:", err);
//         res.status(500).send("Failed to update video record.");
//       }
//     });

//     blobStream.end(file.buffer);
//   }
// );

// router.post(
//   "/upload_video/:id",
//   upload.single("course_video"),
//   async (req, res) => {
//     console.log("Id from post: " + req.params.id);

//     const file = req.file;
//     if (!file) {
//       return res.status(400).send("No file uploaded");
//     }

//     // Delete the former video if it exists
//     let olderFileName = "";
//     const singleVideo = await prisma.Videos.findUnique({
//       where: {
//         id: req.params.id,
//       },
//     });

//     if (singleVideo) {
//       if (singleVideo.location) {
//         olderFileName = singleVideo.location;
//         console.log("OlderFileName: " + olderFileName);

//         const filePath = `course_videos/${olderFileName}`;
//         try {
//           await bucket.file(filePath).delete();
//           console.log("Older File Deleted");
//         } catch (error) {
//           console.error("Error deleting older file: " + error);
//         }
//       } else {
//         console.log("No prior video found.");
//       }
//     }

//     const fileName = Date.now() + "-" + file.originalname;
//     const filePath = `course_videos/${fileName}`;
//     const blob = bucket.file(filePath);

//     // Create a writable stream
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });

//     blobStream.on("error", (err) => {
//       console.error("Blob Stream Error:", err);
//       return res.status(500).send(err.message);
//     });

//     blobStream.on("finish", async () => {
//       console.log("Blob Finished!");
//       try {
//         await prisma.Videos.update({
//           where: {
//             id: req.params.id,
//           },
//           data: { location: fileName },
//         });
//         res.status(201).json({
//           message: "File uploaded successfully!",
//           fileName: file.originalname,
//         });
//       } catch (err) {
//         console.error("Error updating video record:", err);
//         res.status(500).send("Failed to update video record.");
//       }
//     });

//     blobStream.end(file.buffer);
//   }
// );

// router.post(
//   "/upload_video/:id",
//   upload.single("course_video"),
//   async (req, res) => {
//     console.log("Id from post: " + req.params.id);
//     const file = req.file;
//     if (!file) {
//       res.status(400).send("No file uploaded");
//     }

//     //delete the former image
//     let olderFileName = "";
//     const singleVideo = await prisma.Videos.findUnique({
//       where: {
//         id: req.params.id,
//       },
//     });
//     if (singleVideo) {
//       if (!singleVideo.location) {
//         console.log("No prior Image found!");
//       } else if (singleVideo.location != null || singleVideo.location != "") {
//         olderFileName = singleVideo.location;
//         console.log("OlderFileName: " + olderFileName);

//         if (olderFileName != null || olderFileName != "") {
//           const filePath = `course_videos/${olderFileName}`;
//           //const blob = bucket.file(filePath);
//           try {
//             await bucket.file(filePath).delete();
//             console.log("Older File Deleted");
//           } catch (error) {
//             console.log("Error: " + error);
//           }
//         }
//       } else {
//         console.log("New file");
//       }
//     }

//     const fileName = Date.now() + "-" + file.originalname;
//     const filePath = `course_videos/${fileName}`;
//     // convert to a blob

//     const blob = bucket.file(filePath);
//     const blobStream = blob.createWriteStream({
//       metadata: {
//         contentType: file.mimetype,
//       },
//     });
//     blobStream.on("error", (err) => {
//       res.status(500).send(err);
//     });
//     blobStream.on("finish", async () => {
//       console.log("Blob Finished!");
//       console.log("FIle Name: " + fileName);
//       console.log("Id: " + req.params.id);
//       try {
//         const updateVideo = await prisma.Videos.update({
//           where: {
//             id: req.params.id,
//           },
//           data: { location: fileName },
//         });
//         //   res.json(updatePaymentMethod);

//         res.status(201).json({
//           message: "File uploaded successfully!",
//           fileName: file.originalname,
//         });
//       } catch (err) {
//         console.log("Error from catch: " + err);
//       }
//     });

//     blobStream.end(file.buffer);
//   }
// );

router.get("/upload_video", async (req, res, next) => {
  //res.send({ message: "Awesome it works" });
  const filePath = path.join(__dirname, "../views", "index.html");
  res.sendFile(filePath);
});

/// delete a vedio from the uploads folder
router.delete(
  "/deleteVideoFromUploads/:filename/:id",
  checkAuthenticated,
  async (req, res) => {
    if (req.isAuthenticated()) {
      if (req.user.accountType == "Admin") {
        try {
          const { id } = req.params;
          console.log("Id get: " + req.params.id);
          console.log("FileName from params: " + req.params.filename);
          deleteVideo = await prisma.Videos.delete({
            where: {
              id: id,
            },
          });

          if (deleteVideo) {
            if (!deleteVideo.location) {
              console.log("No prior Image found!");
            } else if (
              deleteVideo.location != null ||
              deleteVideo.location != ""
            ) {
              olderFileName = deleteVideo.location;
              console.log("OlderFileName: " + olderFileName);

              if (olderFileName != null || olderFileName != "") {
                const filePath = `course_videos/${olderFileName}`;
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
    const videos = await prisma.videos.findMany({});
    res.json(videos);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleVideo = await prisma.videos.findUnique({
      where: {
        id: id,
      },
    });

    if (singleVideo) {
      console.log("in payment with id 2");
      const signedUrlforFile = await generateSignedUrl(
        "generalfilesbucket",
        "course_videos",
        singleVideo.location
      );
      console.log("print of x: " + signedUrlforFile);
      res.json({ ...singleVideo, videoUrl: signedUrlforFile });
    }
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const video = await prisma.videos.create({
      data: req.body,
    });
    res.json(video);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateVideo = await prisma.videos.update({
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
    deleteVideo = await prisma.videos.delete({
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
