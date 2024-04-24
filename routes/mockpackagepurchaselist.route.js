const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const purchase = await prisma.ExamTakerMockPackagePurchase.findMany({
      include: {
        mockPackage: true,
      },
    });
    res.json(purchase);
  } catch (error) {
    next(error);
  }
});

router.get("/checkphonenumber/:phonenumber", async (req, res, next) => {
  console.log("Phone number requested: " + req.params.phonenumber);
  try {
    const purchase = await prisma.ExamTakerMockPackagePurchase.findMany({
      where: {},
    });
    res.json(purchase);
  } catch (error) {
    next(error);
  }
});

router.get("/checkphonenumberfree/:phonenumber", async (req, res, next) => {
  console.log("Phone number requested: " + req.params.phonenumber);
  try {
    const purchase = await prisma.ExamTaker.findMany({
      where: {
        phoneNumber: req.params.phonenumber,
      },
    });

    const hasResult = purchase.length > 0;
    res.send(hasResult);
  } catch (error) {
    next(error);
  }
});

// router.get(
//   "/accessexam/:phonenumber/:mockid/:examid",
//   async (req, res, next) => {
//     console.log("PhoneNumber" + req.params.phonenumber);
//     console.log("MockId" + req.params.mockid);
//     console.log("ExamId" + req.params.examid);
//     try {
//       const assessmentfound = await prisma.Assesment.findUnique({
//         where: {
//           id: req.params.examid,
//         },
//         include: {
//           question: {
//             orderBy: {
//               questionIndex: "asc",
//             },
//           },
//         },
//       });

//       // console.log("Assessment: " + JSON.stringify(assessmentfound));
//       res.send(assessmentfound);
//     } catch {}
//   }
// );

router.get(
  "/accessexam/:phonenumber/:mockid/:examid",
  async (req, res, next) => {
    console.log("PhoneNumber" + req.params.phonenumber);
    console.log("MockId" + req.params.mockid);
    console.log("ExamId" + req.params.examid);
    try {
      const assessmentfound = await prisma.Assesment.findUnique({
        where: {
          id: req.params.examid,
        },
        include: {
          question: {
            orderBy: {
              questionIndex: "asc",
            },
          },
        },
      });

      const assessmentWithImages = {
        ...assessmentfound,
        question: await Promise.all(
          assessmentfound.question.map(async (q) => {
            const questionImageUrl = await generateSignedUrl(
              "generalfilesbucket",
              "question_images",
              q.questionImage
            );
            const correctionImageUrl = await generateSignedUrl(
              "generalfilesbucket",
              "question_images",
              q.correctionImage
            );
            return {
              ...q,
              questionImageUrl: questionImageUrl,
              correctionImageUrl: correctionImageUrl,
            };
          })
        ),
      };

      res.send(assessmentWithImages);
    } catch (error) {
      console.log("Error from catch:" + error);
      next(error);
    }
  }
);

router.get("/checkpurchase/:phonenumber/:mockid", async (req, res, next) => {
  console.log("Phone number requested: " + req.params.phonenumber);
  console.log("Body: " + req.params.mockid);
  try {
    const examtakerfound = await prisma.ExamTaker.findMany({
      where: {
        phoneNumber: req.params.phonenumber,
      },
    });
    const hasResult = examtakerfound.length > 0;

    if (hasResult) {
      console.log("Has Result: " + hasResult);

      const examPurchasefound =
        await prisma.ExamTakerMockPackagePurchase.findMany({
          where: {
            phoneNumber: req.params.phonenumber,
            mockPackageId: req.params.mockid,
          },
        });
      const hasResult2 = examPurchasefound.length > 0;

      if (hasResult2) {
        const statusOfPayment =
          await prisma.ExamTakerMockPackagePurchase.findMany({
            where: {
              phoneNumber: req.params.phonenumber,
              mockPackageId: req.params.mockid,

              status: "paid",
            },
          });
        const hasResult3 = statusOfPayment.length > 0;

        if (hasResult3) {
          //res.send("success");
          res.status(201).json({ message: "success" });
        } else {
          // res.send("pending");
          res.status(201).json({ message: "pending" });
        }
      } else {
        console.log("not purchased");
        // res.send("not purchased");
        res.status(201).json({ message: "not purchased" });
      }
    } else {
      console.log("new number");
      res.status(201).json({ message: "new number" });
      // res.send("new number");
    }

    // res.send(hasResult);
  } catch (error) {
    console.log("error form catch: " + error);
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const purchase = await prisma.ExamTakerMockPackagePurchase.findUnique({
      where: {
        id: id,
      },
      include: {
        mockPackage: true,
      },
    });
    res.json(purchase);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  console.log("Body: " + JSON.stringify(req.body));
  try {
    const purchase = await prisma.ExamTakerMockPackagePurchase.create({
      data: req.body,
    });
    res.json(purchase);
  } catch (error) {}
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const purchase = await prisma.ExamTakerMockPackagePurchase.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        res.json(purchase);
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
        purchase = await prisma.ExamTakerMockPackagePurchase.delete({
          where: {
            id: id,
          },
        });

        res.json(purchase);
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
