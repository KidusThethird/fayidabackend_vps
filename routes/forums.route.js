const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const forums = await prisma.Forum.findMany({});
    res.json(forums);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/withcourseid/:courseid", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleForum = await prisma.Forum.findUnique({
      where: {
        coursesId: req.params.courseid,
      },
      include: { conversation: true },
    });
    res.json(singleForum);
  } catch (error) {
    next(error);
  }
});

router.get("/withforumid/:forumid", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleForum = await prisma.Forum.findUnique({
      where: {
        id: req.params.forumid,
      },
      include: { conversation: { include: { writtenBy: true } } },
    });
    res.json(singleForum);
  } catch (error) {
    next(error);
  }
});
//check course forum relation
router.get("/checkcourseforum/:course_id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleForum = await prisma.Forum.findMany({
      where: {
        coursesId: req.params.course_id,
      },
    });
    res.json(singleForum);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const forum = await prisma.Forum.create({
      data: req.body,
    });
    res.json(forum);
  } catch (error) {}
});

router.get("/create_forum_for_course/:courseId", async (req, res, next) => {
  try {
    const singleForum = await prisma.Forum.findMany({
      where: {
        coursesId: req.params.courseId,
      },
    });
    console.log("Length: " + singleForum.json);
    let forum;
    if (singleForum.length == 0) {
      // Run forum creation only if singleForum returns a value
      const data = {
        ...req.body,
        coursesId: req.params.courseId,
      };

      forum = await prisma.Forum.create({
        data: data,
      });
      console.log("Forum Created: " + data);
    }

    res.json(forum);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateForum = await prisma.Forum.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updateForum);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deleteForums = await prisma.Forum.delete({
      where: {
        id: id,
      },
    });
    res.json(deleteForums);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
