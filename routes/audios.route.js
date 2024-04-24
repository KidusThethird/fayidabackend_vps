const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const audios = await prisma.audios.findMany({});
    res.json(audios);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleAudio = await prisma.audios.findUnique({
      where: {
        id: id,
      },
    });
    res.json(singleAudio);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const audio = await prisma.audios.create({
      data: req.body,
    });
    res.json(audio);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateAudio = await prisma.audios.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updateAudio);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deleteAudio = await prisma.audios.delete({
      where: {
        id: id,
      },
    });
    res.json(deleteAudio);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
