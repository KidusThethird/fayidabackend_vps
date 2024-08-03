const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const CitySelected = await prisma.CourseUnits.findMany({
      include: { StudentCourse: true },
    });
    res.json(CitySelected);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params.id;
    console.log("rec: " + req.params.id);
    const CitySelected = await prisma.CourseUnits.findUnique({
      where: {
        id: req.params.id,
      },
      include: { StudentCourse: true },
    });
    res.json(CitySelected);
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

router.get("/accessone/:studentId/:courseId/:unit", async (req, res, next) => {
  try {
    //const { id } = req.params.id;
    console.log(
      "rec: " +
        req.params.studentId +
        " " +
        req.params.courseId +
        " " +
        req.params.unit
    );
    // const CitySelected = await prisma.CourseUnits.findUnique({
    //   where: {
    //     id: req.params.id,
    //   },
    // });
    //res.json(CitySelected);

    const getCourseStudent = await prisma.StudentCourse.findFirst({
      where: {
        studentsId: req.params.studentId,
        coursesId: req.params.courseId,
      },
    });
    if (getCourseStudent) {
      const StudentCourseId = getCourseStudent.id;

      const existingCourseUnit = await prisma.CourseUnits.findFirst({
        where: {
          StudentCourseId: getCourseStudent.id,
          unitNumber: req.params.unit,
        },
      });

      if (!existingCourseUnit) {
        await prisma.CourseUnits.create({
          data: {
            StudentCourseId: getCourseStudent.id,
            unitNumber: req.params.unit,
            status: true,
          },
        });
      } else {
        const getCourseStudentUnit = await prisma.CourseUnits.findFirst({
          where: {
            StudentCourseId: StudentCourseId,
            unitNumber: req.params.unit,
          },
        });

        if (getCourseStudent) {
          await prisma.CourseUnits.update({
            where: {
              id: getCourseStudentUnit.id,
            },
            data: {
              status: true,
            },
          });
        }
      }
    }
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

router.get("/removeone/:studentId/:courseId/:unit", async (req, res, next) => {
  try {
    //const { id } = req.params.id;
    console.log(
      "rec: " +
        req.params.studentId +
        "  " +
        req.params.courseId +
        "  " +
        req.params.unit
    );
    // const CitySelected = await prisma.CourseUnits.findUnique({
    //   where: {
    //     id: req.params.id,
    //   },
    // });
    //res.json(CitySelected);

    const getCourseStudent = await prisma.StudentCourse.findFirst({
      where: {
        studentsId: req.params.studentId,
        coursesId: req.params.courseId,
      },
      include: { units: true },
    });

    if (getCourseStudent) {
      const StudentCourseId = getCourseStudent.id;
      console.log("StudentCOurseId: " + StudentCourseId);

      console.log("Idd: " + getCourseStudent.units[req.params.unit - 1].id);
      console.log("Full data: " + JSON.stringify(getCourseStudent));

      const getCourseStudentUnit = await prisma.CourseUnits.findFirst({
        where: {
          StudentCourseId: StudentCourseId,
          unitNumber: req.params.unit,
        },
      });

      console.log("GetCOurseStudentUnit: " + getCourseStudentUnit);
      console.log(
        "GetCOurseStudentUnit: " + JSON.stringify(getCourseStudentUnit)
      );
      console.log("Course Unit Id: " + getCourseStudentUnit.id);

      await prisma.CourseUnits.update({
        where: {
          id: getCourseStudentUnit.id,
        },
        data: {
          status: false,
        },
      });
    }
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

router.get("/removeon/:studentId/:courseId/:unit", async (req, res, next) => {
  try {
    //const { id } = req.params.id;
    console.log(
      "rec: " +
        req.params.studentId +
        "  " +
        req.params.courseId +
        "  " +
        req.params.unit
    );
    // const CitySelected = await prisma.CourseUnits.findUnique({
    //   where: {
    //     id: req.params.id,
    //   },
    // });
    //res.json(CitySelected);

    const getCourseStudent = await prisma.StudentCourse.findFirst({
      where: {
        studentsId: req.params.studentId,
        coursesId: req.params.courseId,
      },
      include: { units: true },
    });

    if (getCourseStudent) {
      const StudentCourseId = getCourseStudent.id;
      console.log("Idd: " + getCourseStudent.units[1].id);
      console.log("Full data: " + JSON.stringify(getCourseStudent));

      const getCourseStudentUnit = await prisma.CourseUnits.findFirst({
        where: {
          StudentCourseId: StudentCourseId,
          unitNumber: req.params.unit,
        },
      });

      await prisma.CourseUnits.update({
        where: {
          id: getCourseStudentUnit.id,
        },
        data: {
          status: false,
        },
      });
    }
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  // console.log("Req: " + req.body.cityName);
  try {
    const CitySelected = await prisma.CourseUnits.create({
      data: req.body,
    });
    res.json(CitySelected);
  } catch (error) {
    console.log("Error from catch: " + error);
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        const CitySelected = await prisma.CourseUnits.update({
          where: {
            id: req.params.id,
          },
          data: req.body,
        });
        res.json(CitySelected);
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
router.delete("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin" || req.user.accountType == "SubAdmin") {
      try {
        const { id } = req.params;
        CitySelected = await prisma.CourseUnits.delete({
          where: {
            id: parseInt(req.params.id),
          },
        });

        res.json(CitySelected);
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
