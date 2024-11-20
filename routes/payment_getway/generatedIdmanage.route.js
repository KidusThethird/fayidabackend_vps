const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
//const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
    try {
      const TransactionList = await prisma.TransactionIdGenerator.findMany({
        include: {
            Student: true, // Include the related 'Student' data
          },
      });
      res.json(TransactionList);
    } catch (error) {
      next(error);
    }
  });

  router.get("/:id", async (req, res, next) => {
    try {
      const { id } = req.params;
      const TransactionId = await prisma.TransactionIdGenerator.findUnique({
        where: {
          id: parseInt(req.params.id)
        },
      });
      res.json(TransactionId);
    } catch (error) {
      next(error);
    }
  });

module.exports = router;
