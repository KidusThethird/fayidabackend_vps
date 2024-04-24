const checkAuthenticated = require("./login_register.route");

const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

//working with students

//Get all student
router.get("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const Messages = await prisma.Messages.findMany({});
        res.json(Messages);
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
        const singleMessage = await prisma.Messages.findUnique({
          where: {
            id: id,
          },
        });
        res.json(singleMessage);
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

//Create a Student
router.post("/", async (req, res, next) => {
  console.log(req.body);
  try {
    const Message = await prisma.Messages.create({
      data: req.body,
    });
    res.json(Message);
  } catch (error) {}
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const updateMessage = await prisma.Messages.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        res.json(updateMessage);
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
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        dleleteMessage = await prisma.Messages.delete({
          where: {
            id: id,
          },
        });
        res.json(dleleteMessage);
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
