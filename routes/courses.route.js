const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const checkAuthenticated = require("./login_register.route");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

const prisma = new PrismaClient();

//working with students

//Get all courses
router.get("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const courses = await prisma.courses.findMany({
          include: { packages: true, Forum: true },
        });
        res.json(courses);
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

//Get one student
router.get("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const singleCourse = await prisma.courses.findUnique({
          where: {
            id: id,
          },
          include: {
            packages: true,
            Forum: true,
            CourseUnitsList: { orderBy: { UnitNumber: "asc" } },
          },
        });
        if (singleCourse) {
          console.log("in payment with id 2");
          const signedUrlforFile = await generateSignedUrl(
            "generalfilesbucket",
            "course_introduction_videos",
            singleCourse.courseIntroductionVideo
          );
          console.log("print of x: " + signedUrlforFile);
          res.json({ ...singleCourse, videoUrl: signedUrlforFile });
        }
      } catch (error) {
        console.log("Error from catch: " + error);
        next(error);
      }
    } else {
      res.json({ Error: "You dont have access" });
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const course = await prisma.courses.create({
          data: req.body,
        });

        res.json(course);
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
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const updateCourse = await prisma.courses.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        res.json(updateCourse);
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

//delete Student
// router.delete("/:id", checkAuthenticated, async (req, res, next) => {
//   if (req.isAuthenticated()) {
//     if (req.user.accountType == "Admin") {
//       try {
//         const { id } = req.params;
//         deleteCourse = await prisma.courses.delete({
//           where: {
//             id: id,
//           },
//         });

//         res.json(deleteCourse);
//       } catch (error) {
//         console.log("Error from catch: " + error);
//         next(error);
//       }
//     } else {
//       res.json({ Error: "You dont have access" });
//     }
//   } else {
//     res.json({ Error: "You dont have access" });
//   }
// });

router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        console.log("Id: " + id);

        deleteCourses = await prisma.courses.delete({
          where: {
            id: req.params.id,
          },
        });

        if (deleteCourses) {
          if (!deleteCourses.courseIntroductionVideo) {
            console.log("No prior Image found!");
          } else if (
            deleteCourses.courseIntroductionVideo != null ||
            deleteCourses.courseIntroductionVideo != ""
          ) {
            olderFileName = deleteCourses.courseIntroductionVideo;
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
        res.json(deleteCourses);
      } catch (error) {
        console.log("Error from catch: " + error);
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
