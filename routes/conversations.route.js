const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const conversations = await prisma.conversations.findMany({
      include: { writtenBy: true },
    });
    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singleConversations = await prisma.conversations.findUnique({
      where: {
        id: id,
      },
    });
    res.json(singleConversations);
  } catch (error) {
    next(error);
  }
});

//Create a Student

router.post("/", async (req, res, next) => {
  console.log(req.body);
  try {
    const Message = await prisma.Conversations.create({
      data: req.body,
    });

    res.json(Message);
  } catch (error) {
    console.log(error);
  }
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateConversation = await prisma.conversations.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updateConversation);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deleteConversations = await prisma.conversations.delete({
      where: {
        id: id,
      },
    });
    res.json(deleteConversations);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
