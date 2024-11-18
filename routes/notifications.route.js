const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

const authenticateToken = require("./authMiddleware");



//working with students

//Get all student
router.get("/", checkAuthenticated, async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const notifications = await prisma.notifications.findMany({
        where: {
          studentsId: req.user.id,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      res.json(notifications);
    } else res.json({ error: "not authenticated" });
  } catch (error) {
    next(error);
  }
});

router.get("/admin/", authenticateToken, async (req, res, next) => {
  if (req.user.id) {


    const UserDetails = await prisma.Students.findUnique({
 
      where: { id: req.user.id },
     
    });
if(UserDetails){
    if (UserDetails.accountType == "Admin") {
      try {
        const notifications = await prisma.notifications.findMany({
          where: {
            addressedTo: "admin",
          },
          orderBy: {
            createdAt: "desc",
          },
        });
        res.json(notifications);
      } catch (error) {
        next(error);
      }
    }}
  } else res.json({ error: "not authenticated" });
});

router.get("/count", authenticateToken, async (req, res) => {

  console.log("User in counts: "+ req.user.id)
  try {
    
      const notifications = await prisma.notifications.findMany({
        where: {
          studentsId: req.user.id,
          status: "0",
        },
      });
      res.json(notifications);
   
  } catch (error) {
   // next(error);
  }
});

router.get("/admin/count", authenticateToken, async (req, res, next) => {
  if (req.user.id) {


    const UserDetails = await prisma.Students.findUnique({
 
      where: { id: req.user.id },
     
    });
if(UserDetails){
    if (UserDetails.accountType == "Admin") {
      try {
        const notifications = await prisma.notifications.findMany({
          where: {
            addressedTo: "admin",
            status: "0",
          },
        });
        res.json(notifications);
      } catch (error) {
        next(error);
      }
    }}
  } else res.json({ error: "not authenticated" });
});

//Get one student
router.get("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    try {
      const { id } = req.params;
      const singleNotification = await prisma.notifications.findUnique({
        where: {
          id: id,
        },
      });
      res.json(singleNotification);
    } catch (error) {
      next(error);
    }
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  try {
    if (req.isAuthenticated()) {
      const notification = await prisma.notifications.create({
        data: req.body,
      });
      res.json(notification);
    } else {
      res.json({ error: "not authenticated" });
    }
  } catch (error) {}
});

//Update Student
router.get(
  "/notification_read/:notification_id",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        //  const { id } = req.params;
        console.log("first");
        const updateNotification = await prisma.notifications.update({
          where: {
            notiId: req.params.notification_id,
            studentsId: req.user.id,
          },
          data: {
            status: "1",
          },
        });
        res.json(updateNotification);
      } else {
        res.json({ error: "not authenticated" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/notification_admin_read/:notification_id",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        //  const { id } = req.params;
        console.log("first");
        const updateNotification = await prisma.notifications.update({
          where: {
            notiId: req.params.notification_id,
            addressedTo: "admin",
          },
          data: {
            status: "1",
          },
        });
        res.json(updateNotification);
      } else {
        res.json({ error: "not authenticated" });
      }
    } catch (error) {
      next(error);
    }
  }
);

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deleteNotification = await prisma.notifications.delete({
      where: {
        id: id,
      },
    });
    res.json(deleteNotification);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
