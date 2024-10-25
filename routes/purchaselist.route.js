const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const sendCustomEmail = require("./helper/sendCustomEmail");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");

const cron = require("node-cron");

// cron.schedule("0 0 * * *", async () => {
//   try {
//     const data = await prisma.PurchaseList.findMany(); // Replace 'tableName' with the actual name of your table

//     for (const item of data) {
//       // Perform your condition check and patch operation here
//       const currentDate = new Date();
//       if (item.expiryDate < currentDate) {
//         const updatedItem = await prisma.PurchaseList.update({
//           where: { id: item.id }, // Assuming 'id' is the primary key of the table
//           data: {
//             paymentStatus: "Expired",
//           },
//         });
//         console.log(`Updated item with ID ${updatedItem.id}`);
//       }
//     }

//     for (const item of data) {
//       // Perform your condition check and patch operation here
//       const currentDate = new Date();
//       console.log("From 60: " + currentDate);
//       if (
//         item.expiryDate - currentDate < 5 &&
//         item.expiryDate - currentDate > 0
//       ) {
//         const updatedItem = await prisma.Students.update({
//           where: { id: item.studentsId }, // Assuming 'id' is the primary key of the table
//           data: {
//             message: "Package is about to Expire!",
//           },
//         });
//         console.log(`Updated item with ID ${updatedItem.id}`);
//       } else {
//         const updatedItem = await prisma.Students.update({
//           where: { id: item.studentsId }, // Assuming 'id' is the primary key of the table
//           data: {
//             message: "",
//           },
//         });
//         console.log(`Updated item with ID ${updatedItem.id}`);
//       }
//     }

//     console.log("Data update completed");
//   } catch (error) {
//     console.error("Error updating data:", error);
//   }
// });

//working with students

//Get all student
router.get("/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const purchaselist = await prisma.PurchaseList.findMany({
          include: {
            Student: true,
            Package: true,
          },
          where: { type: "main" },
          orderBy: {
            createdAt: "desc", // Replace 'asc' with 'desc' if you want to sort in descending order
          },
        });
        res.json(purchaselist);
      } catch (error) {
        next(error);
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get("/update", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const purchaselist = await prisma.PurchaseList.findMany({
          include: {
            Student: true,
            Package: true,
          },
          where: { type: "update" },
          orderBy: {
            createdAt: "desc", // Replace 'asc' with 'desc' if you want to sort in descending order
          },
        });
        res.json(purchaselist);
      } catch (error) {
        next(error);
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get(
  "/filterbyStudentId/:studentId",
  checkAuthenticated,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.accountType == "Admin") {
        try {
          const purchaselist = await prisma.PurchaseList.findMany({
            where: {
              studentsId: req.params.studentId,
            },
            include: {
              Student: true,
              Package: true,
            },
            orderBy: {
              createdAt: "desc", // Replace 'asc' with 'desc' if you want to sort in descending order
            },
          });
          res.json(purchaselist);
        } catch (error) {
          next(error);
        }
      } else {
        res.status(401).json({ message: "User not authenticated" });
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

router.get(
  "/filterPurchase/:purchaseid",
  checkAuthenticated,
  async (req, res, next) => {
    if (req.user.accountType == "Admin") {
      try {
        const purchaselist = await prisma.PurchaseList.findUnique({
          where: {
            id: req.params.purchaseid,
          },
          include: {
            Student: true,
            Package: true,
          },
        });
        res.json(purchaselist);
      } catch (error) {
        next(error);
      }
    } else if (req.user.accountType == "Student") {
      try {
        const purchaselist = await prisma.PurchaseList.findUnique({
          where: {
            id: req.params.purchaseid,
            studentsId: req.user.id,
          },
          include: {
            Student: true,
            Package: true,
          },
        });
        res.json(purchaselist);
      } catch (error) {
        next(error);
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);
router.patch(
  "/filterPurchase/:id",
  checkAuthenticated,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.accountType == "Admin") {
        try {
          const { id } = req.params;
          console.log("body: " + JSON.stringify(req.body));
          console.log("date: " + req.body.dateToAdd);

          // const currentDate = new Date();
          // console.log("New Date :" + currentDate());
          // expDate.setDate(currentDate.getDate() + parseInt(req.body.dateToAdd));
          //  console.log("ExpDate: " + expDate);

          const Datetoadd = parseInt(req.body.dateToAdd);

          // if (req.body.paymentStatus == "active") {
          //   Datetoadd = parseInt(req.body.dateToAdd);
          // }

          const expiryDate = new Date();

          expiryDate.setDate(expiryDate.getDate() + Datetoadd);
          console.log("Expriy date now: " + expiryDate);
          console.log("Expriy date now2: " + expiryDate.toLocaleDateString());
          console.log("Expriy date now3: " + expiryDate.toString());

          const updatePurchaselist = await prisma.PurchaseList.update({
            where: {
              id: id,
            },
            // data: req.body,
            data: {
              // name: "test",
              paymentStatus: req.body.paymentStatus,
              activatedDate: new Date(),
              expiryDate: expiryDate,
            },
          });

          const packagePrice = req.body.packagePrice;

          const StudentFind = await prisma.students.findUnique({
            where: { id: req.body.studentId },
          });
          if (StudentFind) {
            const Agent = await prisma.students.findFirst({
              where: {
                accountType: "agent",
                promocode: StudentFind.promocode,
              },
            });

            if (Agent) {
              const commisionPercent = await prisma.configuration.findUnique({
                where: {
                  id: "53962976-afd5-4c1a-b612-decb5fd1eeeb",
                },
              });

              const commisionValue = commisionPercent.agentCommisionRate;
              console.log("Commision Value: " + commisionValue);
              console.log("Package Price: " + packagePrice);
              const ExistingAgentBalance = parseFloat(Agent.balance);
              const FinalValue =
                (parseFloat(packagePrice) * parseFloat(commisionValue)) / 100;
              const Total = FinalValue + ExistingAgentBalance;
              const updateAgentValue = await prisma.students.update({
                where: {
                  id: Agent.id,
                },
                data: {
                  balance: Total.toString(),
                },
              });
            }
          }

          res.json(updatePurchaselist);
        } catch (error) {
          next(error);
        }
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

router.patch(
  "/filterPurchase/reverse/:id",
  checkAuthenticated,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.accountType == "Admin") {
        try {
          const { id } = req.params;
          console.log("body: " + JSON.stringify(req.body));
          console.log("date: " + req.body.dateToAdd);

          // const currentDate = new Date();
          // console.log("New Date :" + currentDate());
          // expDate.setDate(currentDate.getDate() + parseInt(req.body.dateToAdd));
          //  console.log("ExpDate: " + expDate);

          //   const Datetoadd = parseInt(req.body.dateToAdd);

          // if (req.body.paymentStatus == "active") {
          //   Datetoadd = parseInt(req.body.dateToAdd);
          // }

          const updatePurchaselist = await prisma.PurchaseList.update({
            where: {
              id: id,
            },
            // data: req.body,
            data: {
              // name: "test",
              paymentStatus: req.body.paymentStatus,
              // activatedDate: new Date(),
              // expiryDate: expiryDate,
            },
          });
          res.json(updatePurchaselist);
        } catch (error) {
          next(error);
        }
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

router.patch(
  "/filterPurchase/update/:id",
  checkAuthenticated,
  async (req, res, next) => {
    if (req.isAuthenticated()) {
      if (req.user.accountType == "Admin") {
        try {
          const { id } = req.params;
          console.log("bodyyyy: " + JSON.stringify(req.body));
          console.log("date: " + req.body.dateToAdd);

          // const currentDate = new Date();
          // console.log("New Date :" + currentDate());
          // expDate.setDate(currentDate.getDate() + parseInt(req.body.dateToAdd));
          //  console.log("ExpDate: " + expDate);

          var Datetoadd = parseInt(req.body.dateToAdd);
          const Today = new Date();

          if (Datetoadd >= 0) {
            console.log("Date to add is positive");
          } else {
            console.log("Date to add is negative, so it is set to zero");
            Datetoadd = 0;
          }
          const PackageId = req.body.packageId;
          console.log("Package ID: " + PackageId);
          // if (req.body.paymentStatus == "active") {
          //   Datetoadd = parseInt(req.body.dateToAdd);
          // }
          console.log("StudentId: " + req.body.studentId);
          const FetchMainPurchase = await prisma.PurchaseList.findFirst({
            where: {
              studentsId: req.body.studentId,
              packagesId: PackageId,
              type: "main",
            },
          });
          console.log("first print");
          console.log(
            "FetchMainPurchase: " + JSON.stringify(FetchMainPurchase)
          );
          console.log("FetchMainPurchase Id: " + FetchMainPurchase.id);

          if (FetchMainPurchase) {
            var expiryDate = FetchMainPurchase.expiryDate;
            console.log("Today: " + Today.toLocaleString());

            var CurrentDate = new Date();
            var remainingTime = expiryDate.getTime() - CurrentDate.getTime();
            var remainingDays = Math.ceil(
              remainingTime / (1000 * 60 * 60 * 24)
            );

            if (remainingDays > 0) {
              // The expiry date is already expired
              console.log("The expiry date has remaining days");
              expiryDate.setDate(expiryDate.getDate() + Datetoadd);
            } else {
              console.log("No dates left for the expirydate");
              // The expiry date is not yet expired
              // expiryDate.setDate(Today + Datetoadd);
              expiryDate = new Date();
              expiryDate.setDate(expiryDate.getDate() + Datetoadd);
            }
            console.log("Second print");
            const updatePurchaselist = await prisma.PurchaseList.update({
              where: {
                id: FetchMainPurchase.id,
              },
              // data: req.body,
              data: {
                //name: "test",
                //   paymentStatus: req.body.paymentStatus,
                activatedDate: new Date(),
                expiryDate: expiryDate,
              },
            });
            console.log("third print");

            // const packagePrice = req.body.packagePrice;

            // const StudentFind = await prisma.students.findUnique({
            //   where: { id: req.body.studentId },
            // });
            // if (StudentFind) {
            //   const Agent = await prisma.students.findFirst({
            //     where: {
            //       accountType: "agent",
            //       promocode: StudentFind.promocode,
            //     },
            //   });

            //   if (Agent) {
            //     const commisionPercent = await prisma.configuration.findUnique({
            //       where: {
            //         id: "53962976-afd5-4c1a-b612-decb5fd1eeeb",
            //       },
            //     });

            //     const commisionValue = commisionPercent.agentCommisionRate;
            //     console.log("Commision Value: " + commisionValue);
            //     console.log("Package Price: " + packagePrice);
            //     const ExistingAgentBalance = parseFloat(Agent.balance);
            //     const FinalValue =
            //       (parseFloat(packagePrice) * parseFloat(commisionValue)) / 100;
            //     const Total = FinalValue + ExistingAgentBalance;
            //     const updateAgentValue = await prisma.students.update({
            //       where: {
            //         id: Agent.id,
            //       },
            //       data: {
            //         balance: Total.toString(),
            //       },
            //     });
            //   }
            // }

            const updatePurchaselist2 = await prisma.PurchaseList.update({
              where: {
                id: id,
              },
              // data: req.body,
              data: {
                // name: "test",
                paymentStatus: "done",
                activatedDate: new Date(),
                updatePackageStatus: "done",
                // expiryDate: expiryDate,
              },
            });
            res.json(updatePurchaselist);
          }
        } catch (error) {
          console.log("Error from catch: " + error);
          next(error);
        }
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

router.get("/studentCourses/", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const StudentCourses = await prisma.StudentCourse.findMany({
          include: {
            Packages: true,
          },
        });
        res.json(StudentCourses);
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

//this router is for test, it should be deleted after testing completed
router.get("/purchasetest/", async (req, res, next) => {
  try {
    const StudentCourses = await prisma.PurchaseList.findMany({
      // include: {
      //   Packages: true,
      // },
    });
    res.json(StudentCourses);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/specificStudentCourses/",
  checkAuthenticated,
  async (req, res, next) => {
    console.log("Initial is printed");
    if (req.isAuthenticated()) {
      console.log("authentication is printed");
      if (req.user.accountType == "Student") {
        console.log("student is in");
        try {
          const paidPackages = await prisma.PurchaseList.findMany({
            where: {
              studentsId: req.user.id,
              paymentStatus: "active",
            },
            select: {
              packagesId: true,
            },
          });

          //  console.log("Paid Packages: " + JSON.stringify(paidPackages));
          const StudentCourses = await prisma.StudentCourse.findMany({
            where: {
              studentsId: req.user.id,

              packageId: {
                in: paidPackages.map((package) => package.packagesId),
              },
            },
            include: {
              Courses: {
                include: { materials: { include: { StudentMaterial: true } } },
              },
              Packages: true,
            },
          });

          const StudentCourseWithPackageUrl = await Promise.all(
            StudentCourses.map(async (pac) => {
              const signedUrlforFile = await generateSignedUrl(
                "generalfilesbucket",
                "package_thumbnails",
                pac.Packages.thumbnail
              );
              return { ...pac, packageImgUrl: signedUrlforFile };
            })
          );
          //  console.log("Paid Packages 2: " + JSON.stringify(StudentCourses));

          res.json(StudentCourseWithPackageUrl);
        } catch (error) {
          console.log("Error from catch: " + error);
          next(error);
        }
      } else if (req.user.accountType == "Admin") {
        try {
          const paidPackages = await prisma.PurchaseList.findMany({
            where: {
              paymentStatus: "active",
            },
            select: {
              packagesId: true,
            },
          });
          const StudentCourses = await prisma.StudentCourse.findMany({
            where: {
              // studentsId: req.user.id,

              packageId: {
                in: paidPackages.map((package) => package.packagesId),
              },
            },
            include: {
              Courses: {
                include: { materials: { include: { StudentMaterial: true } } },
              },
              Packages: true,
            },
          });

          res.json(StudentCourses);
        } catch (error) {
          next(error);
        }
      }
    } else {
      res.json({ message: "not authenticated" });
    }
    // else{res.json({"message":""})
  }
);

router.get(
  "/specificStudentSingleCourse/:courseId",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        const paidPackages = await prisma.PurchaseList.findMany({
          where: {
            studentsId: req.user.id,
            paymentStatus: "active",
          },
          select: {
            packagesId: true,
          },
        });

        const FilterUnits = await prisma.CourseUnits.findMany({
          where: {
            StudentCourse: {
              studentsId: req.user.id,
              coursesId: req.params.courseId,
            },
          },

          select: {
            unitNumber: true,
            status: true,
          },
        });
        console.log("FilteredUnits: " + JSON.stringify(FilterUnits));

        const unitStatusMap = FilterUnits.reduce((map, unit) => {
          map[unit.unitNumber] = unit.status;
          return map;
        }, {});

        const StudentCourses = await prisma.StudentCourse.findMany({
          where: {
            studentsId: req.user.id,

            packageId: {
              in: paidPackages.map((package) => package.packagesId),
            },
            coursesId: req.params.courseId,
          },
          include: {
            Courses: {
              include: {
                materials: {
                  orderBy: [
                    {
                      part: "asc",
                    },
                    {
                      materialIndex: "asc",
                    },
                  ],
                  include: {
                    video: true,
                    assementId: true,
                    file: true,
                    link: true,
                    StudentMaterial: true,
                  },
                },
                CourseUnitsList: true,
              },
            },
            Packages: true,
          },
        });

        StudentCourses.forEach((course) => {
          course.Courses.materials.forEach((material) => {
            const unitStatus = unitStatusMap[material.part];
            material.Access = unitStatus ? "unlocked" : "locked";
          });
        });

        res.json(StudentCourses);
      } else {
        res.status(401).json({ message: "not authenticated" });
      }
    } catch (error) {
      console.log("Error from catch: " + error);
      next(error);
    }
  }
);

router.get(
  "/specificStudentSingleVideo/:videoId",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        const paidPackages = await prisma.PurchaseList.findMany({
          where: {
            studentsId: req.user.id,
            paymentStatus: "active",
          },
          select: {
            packagesId: true,
          },
        });

        const paidCourses = await prisma.StudentCourse.findMany({
          where: {
            studentsId: req.user.id,
            packageId: {
              in: paidPackages.map((package) => package.packagesId),
            },
          },

          select: {
            coursesId: true,
          },
        });
        const CheckVideo = await prisma.Videos.findMany({
          where: {
            id: req.params.videoId,

            course: {
              in: paidCourses.map((course) => course.coursesId),
            },
          },
        });

        res.json(CheckVideo);
      } else {
        res.status(401).json({ message: "not authenticated" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/specificStudentSingleAssessment/:assessmentId",
  checkAuthenticated,
  async (req, res, next) => {
    try {
      if (req.isAuthenticated()) {
        const paidPackages = await prisma.PurchaseList.findMany({
          where: {
            studentsId: req.user.id,
            //check
            paymentStatus: "active",
          },
          select: {
            packagesId: true,
          },
        });
        //  console.log("PaidPackages:" + paidPackages);
        const paidCourses = await prisma.StudentCourse.findMany({
          where: {
            studentsId: req.user.id,
            packageId: {
              in: paidPackages.map((package) => package.packagesId),
            },
          },

          select: {
            coursesId: true,
          },
        });
        //   console.log("paidCOurses:" + paidCourses);
        const CheckAssessment = await prisma.Assesment.findMany({
          where: {
            id: req.params.assessmentId,

            course: {
              in: paidCourses.map((course) => course.coursesId),
            },
          },
          include: {
            question: {
              orderBy: {
                questionIndex: "asc", // Sort questions in ascending order by name
              },
            },
          },
        });

        /////////////////////

        // const assessmentWithImages = {
        //   ...CheckAssessment,
        //   question: await Promise.all(
        //     CheckAssessment[0].question.map(async (q) => {
        //       const questionImageUrl = await generateSignedUrl(
        //         "generalfilesbucket",
        //         "question_images",
        //         q.questionImage
        //       );
        //       const correctionImageUrl = await generateSignedUrl(
        //         "generalfilesbucket",
        //         "question_images",
        //         q.correctionImage
        //       );
        //       return {
        //         ...q,
        //         questionImageUrl: questionImageUrl,
        //         correctionImageUrl: correctionImageUrl,
        //       };
        //     })
        //   ),
        // };
        // res.send(assessmentWithImages);

        /////////////////////

          res.json(CheckAssessment);
      } else {
        res.status(401).json({ message: "not authenticated" });
      }
    } catch (error) {
      next(error);
    }
  }
);
//Get purchases from one user
router.get("/", async (req, res, next) => {
  try {
    const purchaselist = await prisma.PurchaseList.findMany({});
    res.json(purchaselist);
  } catch (error) {
    next(error);
  }
});

//Get one student
// router.get("/getpuchasedlist", checkAuthenticated, async (req, res, next) => {
//   try {
//     if (req.isAuthenticated()) {
//       const { id } = req.params;
//       const singlePurchaselist = await prisma.PurchaseList.findMany({
//         where: {
//           studentsId: req.user.id,
//           type: "main",
//         },
//         include: {
//           Package: {
//             include: {
//               courses: true,
//             },
//           },
//         },
//       });
//       res.json(singlePurchaselist);
//     } else {
//       res.status(401).json({ message: "failed" });
//     }
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/getpuchasedlist", checkAuthenticated, async (req, res, next) => {
  console.log("PuchaseList");
  try {
    if (req.isAuthenticated()) {
      const singlePurchaselist = await prisma.PurchaseList.findMany({
        where: {
          studentsId: req.user.id,
          type: "main",
        },
        include: {
          Package: {
            include: {
              courses: true,
            },
          },
        },
      });

      const packagesWithUrls = await Promise.all(
        singlePurchaselist.map(async (purchase) => {
          const signedUrlforThumbnail = await generateSignedUrl(
            "generalfilesbucket",
            "package_thumbnails",
            purchase.Package.thumbnail
          );
          const packageWithUrl = {
            ...purchase.Package,
            thumbnailUrl: signedUrlforThumbnail,
          };
          return { ...purchase, Package: packageWithUrl };
        })
      );

      res.json(packagesWithUrls);
    } else {
      res.status(401).json({ message: "failed" });
    }
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", checkAuthenticated, async (req, res, next) => {
  console.log("first");
  console.log(req.isAuthenticated());
  try {
    if (req.isAuthenticated()) {
      if (req.user.studentStatus == "active") {
        console.log("code: " + req.user.firstName);
        console.log(req.body);
        const purchaseInfo = {
          ...req.body,
          studentsId: req.user.id,
          type: "main",
        };
        const alreadyPurchasedInfo = {
          ...req.body,
          studentsId: req.user.id,
          type: "update",
          updatePackageStatus: "on",
        };
        // console.log(x);

        const checkIfPuchasedAlready = await prisma.PurchaseList.findFirst({
          where: {
            studentsId: req.user.id,
            packagesId: req.body.packagesId,
          },
        });
        //if (checkIfPuchasedAlready) {
        if (!checkIfPuchasedAlready) {
          const purchaselist = await prisma.PurchaseList.create({
            data: purchaseInfo,
          });

          const addNotificationtoAdmin = await prisma.Notifications.create({
            data: {
              type: "0",

              //studentsId: req.user.id,
              addressedTo: "admin",
              notiHead: `${req.user.firstName} ${req.user.lastName}  requested a purchase.`,
              notiFull: `${req.user.firstName} ${req.user.lastName} has requested a purchase!`,
              status: "0",
            },
          });
          console.log("uem" + req.user.email);
          console.log("FN" + req.user.firstName);
          // console.log("ItemName" + req.body.itemName);
          //  console.log("PrizeId" + studentPrizeId);
          const purchaselistId = purchaselist.id;
          if (purchaselistId) {
            console.log("purchaseList Recorded: ", purchaselist);
            const returnValue = sendCustomEmail.emailsender(
              req.user.email,
              req.user.firstName,
              "You have ordered a package!",
              `Your purchase id is [${purchaselistId}], `,
              "We will approve as soon as possible!"
            );

            const addNotification = await prisma.Notifications.create({
              data: {
                type: "0",
                studentsId: req.user.id,
                addressedTo: "s",
                notiHead: "Purchase Made.",
                notiFull: `You have successfuly made a purchase request with id [${purchaselistId}]!`,
                status: "0",
              },
            });
          }

          console.log("this is also printed");
          const package = await prisma.Packages.findUnique({
            where: {
              id: req.body.packagesId,
            },
            include: {
              courses: true,
            },
          });

          if (package) {
            console.log("here 2");
            // console.log(package);
            const courseIds = package.courses.map(
              (course) => course.id,
              console.log("this")
            );
            console.log("Course IDs in the package:", courseIds);
            const createStudentCourses = await Promise.all(
              courseIds.map(async (courseId) => {
                const checkCourseRepeated =
                  await prisma.StudentCourse.findFirst({
                    where: {
                      studentsId: req.user.id,
                      coursesId: courseId,
                    },
                  });
                if (!checkCourseRepeated) {
                  const createdStudentCourse =
                    await prisma.StudentCourse.create({
                      data: {
                        studentsId: req.user.id,
                        coursesId: courseId,
                        packageId: req.body.packagesId,
                      },
                    });
                }

                // console.log("Course: " + courseId);
                // return createdStudentCourse;
              })
            );

            // res.json(createStudentCourses);
            //  await Promise.all(createStudentCourses);

            console.log("Student courses created successfully.");
          } else {
            console.log("Package not found.");
          }
          // res.json(purchaselist);
          res.status(201).json({ message: "success" });
        } else {
          const purchaselist = await prisma.PurchaseList.create({
            data: alreadyPurchasedInfo,
          });

          const addNotificationtoAdmin = await prisma.Notifications.create({
            data: {
              type: "0",

              //studentsId: req.user.id,
              addressedTo: "admin",
              notiHead: `${req.user.firstName} ${req.user.lastName}  requested an update in package.`,
              notiFull: `${req.user.firstName} ${req.user.lastName} has requested an update!`,
              status: "0",
            },
          });

          // console.log("ItemName" + req.body.itemName);
          //  console.log("PrizeId" + studentPrizeId);
          const purchaselistId = purchaselist.id;
          if (purchaselistId) {
            //  console.log("purchaseList Recorded: ", purchaselist);
            const returnValue = sendCustomEmail.emailsender(
              req.user.email,
              req.user.firstName,
              "You have ordered an update in a package!",
              `Your purchase id is [${purchaselistId}], `,
              "We will approve as soon as possible!"
            );

            const addNotification = await prisma.Notifications.create({
              data: {
                type: "0",
                studentsId: req.user.id,
                addressedTo: "s",
                notiHead: "Purchase Made.",
                notiFull: `You have successfuly made a package update request with id [${purchaselistId}]!`,
                status: "0",
              },
            });
          }

          console.log("this is also printed");
          const package = await prisma.Packages.findUnique({
            where: {
              id: req.body.packagesId,
            },
            include: {
              courses: true,
            },
          });

          if (package) {
            console.log("here 2");
            // console.log(package);
            const courseIds = package.courses.map(
              (course) => course.id,
              console.log("this")
            );
            console.log("Course IDs in the package:", courseIds);
            const createStudentCourses = await Promise.all(
              courseIds.map(async (courseId) => {
                const checkCourseRepeated =
                  await prisma.StudentCourse.findFirst({
                    where: {
                      studentsId: req.user.id,
                      coursesId: courseId,
                    },
                  });
                if (!checkCourseRepeated) {
                  const createdStudentCourse =
                    await prisma.StudentCourse.create({
                      data: {
                        studentsId: req.user.id,
                        coursesId: courseId,
                        packageId: req.body.packagesId,
                      },
                    });
                }

                // console.log("Course: " + courseId);
                // return createdStudentCourse;
              })
            );

            // res.json(createStudentCourses);
            //  await Promise.all(createStudentCourses);

            console.log("Student courses created successfully.");
          } else {
            console.log("Package not found.");
          }
          // res.json(purchaselist);
          res.status(201).json({ message: "success" });

          res.status(401).json({ message: "already_purchased" });
        }
      } else {
        res.status(401).json({ message: "inactive" });
      }
    } else {
      res.status(401).json({ message: "failed" });
    }
  } catch (error) {
    return res.status(501);
  }
});

//Update Student
router.patch("/:id", checkAuthenticated, async (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.accountType == "Admin") {
      try {
        const { id } = req.params;
        const updatePurchaselist = await prisma.PurchaseList.update({
          where: {
            id: id,
          },
          data: req.body,
        });
        res.json(updatePurchaselist);
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
        deletePurchaselist = await prisma.PurchaseList.delete({
          where: {
            id: id,
          },
        });
        res.json(deletePurchaselist);
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
