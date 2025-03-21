const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");
const sendCustomEmail = require("./helper/sendCustomEmail");
const { generateSignedUrl } = require("./helper/bucketurlgenerator");
const authenticateToken = require("./authMiddleware");
const axios = require("axios");
const { localUrl } = require("../configFIles");

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
router.get("/", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    console.log("Logged in: " + req.user.id);
    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.user.id },
    });
    if (UserDetails) {
      if (
        UserDetails.accountType == "Admin" ||
        UserDetails.accountType == "Assistant" ||
        UserDetails.accountType == "SubAdmin"
      ) {
        console.log("Act type = " + UserDetails.accountType);
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
    }
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get("/update", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.user.id },
    });

    if (UserDetails) {
      if (
        UserDetails.accountType == "Admin" ||
        UserDetails.accountType == "Assistant" ||
        UserDetails.accountType == "SubAdmin"
      ) {
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
  } else {
    res.status(401).json({ message: "User not authenticated" });
  }
});

router.get(
  "/filterbyStudentId/:studentId",
  authenticateToken,
  async (req, res, next) => {
    if (req.user.id) {
      const UserDetails = await prisma.Students.findUnique({
        where: { id: req.user.id },
      });

      if (UserDetails) {
        if (
          UserDetails.accountType == "Admin" ||
          UserDetails.accountType == "Assistant" ||
          UserDetails.accountType == "SubAdmin"
        ) {
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
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

router.get(
  "/filterPurchase/:purchaseid",
  authenticateToken,
  async (req, res, next) => {
    if (req.user.id) {
      const UserDetails = await prisma.Students.findUnique({
        where: { id: req.user.id },
      });

      if (UserDetails) {
        if (
          UserDetails.accountType == "Admin" ||
          UserDetails.accountType == "Assistant" ||
          UserDetails.accountType == "SubAdmin"
        ) {
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
        } else if (UserDetails.accountType == "Student") {
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
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);
router.patch(
  "/filterPurchase/:id",

  async (req, res, next) => {
    console.log("Patch update is started");
    console.log("Body to patch update: " + JSON.stringify(req.body));

    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.body.studentId },
    });

    console.log("user: " + JSON.stringify(UserDetails));
    if (UserDetails) {
      try {
        const { id } = req.params;
        console.log("body: " + JSON.stringify(req.body));
        console.log("date: " + req.body.dateToAdd);

        // const currentDate = new Date();
        // console.log("New Date :" + currentDate());
        // expDate.setDate(currentDate.getDate() + parseInt(req.body.dateToAdd));
        //  console.log("ExpDate: " + expDate);

        const Datetoadd = parseInt(req.body.dateToAdd);
        console.log("Date to add: " + Datetoadd);
        // if (req.body.paymentStatus == "active") {
        //   Datetoadd = parseInt(req.body.dateToAdd);
        // }

        // const expiryDate = new Date();

        // expiryDate.setDate(expiryDate.getDate() + Datetoadd);
        // console.log("Expriy date now: " + expiryDate);
        // console.log("Expriy date now2: " + expiryDate.toLocaleDateString());
        // console.log("Expriy date now3: " + expiryDate.toString());

        const FindMainPurchaseId = await prisma.PurchaseList.findFirst({
          where: {
            studentsId: req.body.studentId,
            packagesId: req.body.packageId,
            type: "main",
          },
        });
        let updatePurchaselist;
        if (FindMainPurchaseId) {
          const existingExpiryDate = new Date(FindMainPurchaseId.expiryDate);

          // Ensure it's a Date object
          const newExpiryDate = new Date(existingExpiryDate); // Create a copy of the existing date
          newExpiryDate.setDate(
            existingExpiryDate.getDate() + parseInt(Datetoadd)
          ); // Add 30 days

          updatePurchaselist = await prisma.PurchaseList.update({
            where: {
              id: FindMainPurchaseId.id,
            },
            data: {
              paymentStatus: "done",
              activatedDate: new Date(),
              expiryDate: newExpiryDate, // Set the updated expiry date
            },
          });
        }

        console.log("FIndMainPurchase: " + JSON.stringify(FindMainPurchaseId));

        // const updatePurchaselist = await prisma.PurchaseList.update({
        //   where: {
        //     id: id,
        //   },
        //   // data: req.body,
        //   data: {
        //     // name: "test",
        //     paymentStatus: "active",
        //     activatedDate: new Date(),
        //     expiryDate: expiryDate,
        //   },
        // });

        console.log("Updated: " + JSON.stringify(updatePurchaselist));

        // if(1==2){
        // try{
        //   console.log("PackageId :"+ req.body.packageId)
        //   let PackageFetch;
        //  PackageFetch = await prisma.Packages.findUnique({

        //   where: { id: req.body.packageId},

        // });

        // console.log("PackageFetch: "+JSON.stringify(PackageFetch))}catch(e){console.log("Error: "+e)}
        //           const packagePrice = PackageFetch.price;
        // console.log("Price" + packagePrice)
        //           const StudentFind = await prisma.students.findUnique({
        //             where: { id: req.body.studentId },
        //           });
        //           console.log("Student Find: "+StudentFind )
        //           if (StudentFind) {
        //             console.log("Inside studnet" + JSON.stringify(StudentFind))
        //             const Agent  = await prisma.students.findFirst({
        //               where: {
        //                 accountType: "agent",
        //                 promocode: StudentFind.promocode,
        //               },
        //             });
        // console.log("Agent: "+ JSON.stringify(Agent))
        //             if (Agent) {
        //               console.log("Agent is in")
        //               const commisionPercent = await prisma.configuration.findUnique({
        //                 where: {
        //                   id: "53962976-afd5-4c1a-b612-decb5fd1eeeb",
        //                 },
        //               });

        //               const commisionValue = commisionPercent.agentCommisionRate;

        //               console.log("Commision Value: " + commisionValue);
        //              // console.log("Package Price: " + packagePrice);
        //               const ExistingAgentBalance = parseFloat(Agent.balance);
        //               const FinalValue =
        //                 (parseFloat(packagePrice) * parseFloat(commisionValue)) / 100;
        //               const Total = FinalValue + ExistingAgentBalance;
        //               const updateAgentValue = await prisma.students.update({
        //                 where: {
        //                   id: Agent.id,
        //                 },
        //                 data: {
        //                   balance: Total.toString(),
        //                 },
        //               });
        //             }
        //           }

        //          // res.json(updatePurchaselist);
        //         }
        console.log("End is here");
        res.json({ message: "working" });
      } catch (error) {
        console.log("Error from catch: " + error);
        next(error);
      }
    }
  }
);

router.patch(
  "/filterPurchase/reverse/:id",
  authenticateToken,
  async (req, res, next) => {
    if (req.user.id) {
      const UserDetails = await prisma.Students.findUnique({
        where: { id: req.user.id },
      });

      if (UserDetails) {
        if (
          UserDetails.accountType == "Admin" ||
          UserDetails.accountType == "Assistant" ||
          UserDetails.accountType == "SubAdmin"
        ) {
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
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

router.patch(
  "/filterPurchase/update/:id",
  authenticateToken,
  async (req, res, next) => {
    if (req.user.id) {
      const UserDetails = await prisma.Students.findUnique({
        where: { id: req.user.id },
      });

      if (UserDetails) {
        if (
          UserDetails.accountType == "Admin" ||
          UserDetails.accountType == "Assistant" ||
          UserDetails.accountType == "SubAdmin"
        ) {
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
      }
    } else {
      res.status(401).json({ message: "User not authenticated" });
    }
  }
);

router.get("/studentCourses/", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.user.id },
    });

    if (UserDetails) {
      if (
        UserDetails.accountType == "Admin" ||
        UserDetails.accountType == "Assistant" ||
        UserDetails.accountType == "SubAdmin"
      ) {
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
  authenticateToken,
  async (req, res, next) => {
    console.log("Initial is printed");
    if (req.user.id) {
      console.log("authentication is printed");

      const UserDetails = await prisma.Students.findUnique({
        where: { id: req.user.id },
      });
      if (UserDetails) {
        if (UserDetails.accountType == "Student") {
          console.log("student is in");
          try {
            const paidPackages = await prisma.PurchaseList.findMany({
              where: {
                studentsId: req.user.id,
                OR: [{ paymentStatus: "active" }, { paymentStatus: "done" }],
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
                  include: {
                    materials: { include: { StudentMaterial: true } },
                  },
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
        } else if (
          UserDetails.accountType == "Admin" ||
          UserDetails.accountType == "Assistant" ||
          UserDetails.accountType == "SubAdmin"
        ) {
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
                  include: {
                    materials: { include: { StudentMaterial: true } },
                  },
                },
                Packages: true,
              },
            });

            res.json(StudentCourses);
          } catch (error) {
            next(error);
          }
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
  authenticateToken,
  async (req, res, next) => {
    try {
      console.log("trying to render courses");
      if (req.user.id) {
        console.log("UserId: " + req.user.id);
        const paidPackages = await prisma.PurchaseList.findMany({
          where: {
            studentsId: req.user.id,
            paymentStatus: { in: ["active", "done"] }, // Matches either "active" or "done"
          },
          select: {
            packagesId: true,
          },
        });
        console.log("PaidPackages: " + JSON.stringify(paidPackages));

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
  authenticateToken,
  async (req, res, next) => {
    try {
      if (req.user.id) {
        const paidPackages = await prisma.PurchaseList.findMany({
          where: {
            studentsId: req.user.id,
            paymentStatus: "active",
          },
          select: {
            packagesId: true,
          },
        });

        if (paidPackages) {
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
        }

        if (paidCourses) {
          const CheckVideo = await prisma.Videos.findMany({
            where: {
              id: req.params.videoId,

              course: {
                in: paidCourses.map((course) => course.coursesId),
              },
            },
          });

          res.json(CheckVideo);
        }
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
  authenticateToken,
  async (req, res, next) => {
    try {
      //req.isAuthenticated();

      if (req.user.id) {
        console.log("User Id: " + req.user.id);
        const paidPackages = await prisma.PurchaseList.findMany({
          where: {
            studentsId: req.user.id,
            //studentsId: "716d3050-2916-447a-88a2-c4316ce4a2a1",
            //716d3050-2916-447a-88a2-c4316ce4a2a1
            //check
            paymentStatus: { in: ["active", "done"] },
          },
          select: {
            packagesId: true,
          },
        });
        //  console.log("PaidPackages:" + paidPackages);
        const paidCourses = await prisma.StudentCourse.findMany({
          where: {
            studentsId: req.user.id,
            //studentsId: "716d3050-2916-447a-88a2-c4316ce4a2a1",
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

        ///////////////////////////////////////////////////////////////////////////////
        // Assume CheckAssessment is an array as shown in your JSON example.
        // const assessmentWithImages = await Promise.all(
        //   CheckAssessment.map(async (assessment) => {
        //     const questionsWithImages = await Promise.all(
        //       assessment.question.map(async (q) => {
        //         const questionImageUrl = q.questionImage
        //           ? await generateSignedUrl(
        //               "generalfilesbucket",
        //               "question_images",
        //               q.questionImage
        //             )
        //           : null;

        //         const correctionImageUrl = q.correctionImage
        //           ? await generateSignedUrl(
        //               "generalfilesbucket",
        //               "question_images",
        //               q.correctionImage
        //             )
        //           : null;

        //         return {
        //           ...q,
        //           questionImageUrl,
        //           correctionImageUrl,
        //         };
        //       })
        //     );

        //     return {
        //       ...assessment,
        //       question: questionsWithImages,
        //     };
        //   })
        // );

        // // Send the modified response
        // res.send(assessmentWithImages);

        ///////////////////////////////////////////////////////////////////////////////

        const assessmentWithImages = await Promise.all(
          CheckAssessment.map(async (assessment) => {
            const questionsWithImages = await Promise.all(
              assessment.question.map(async (q) => {
                const questionImageUrl = q.questionImage
                  ? await generateSignedUrl(
                      "generalfilesbucket",
                      "question_images",
                      q.questionImage
                    )
                  : "0"; // Replace null with "0"

                const correctionImageUrl = q.correctionImage
                  ? await generateSignedUrl(
                      "generalfilesbucket",
                      "question_images",
                      q.correctionImage
                    )
                  : "0"; // Replace null with "0"

                return {
                  ...q,
                  questionImageUrl: questionImageUrl[0], // Accessing the first element
                  correctionImageUrl: correctionImageUrl[0], // Accessing the first element
                };
              })
            );

            return {
              ...assessment,
              question: questionsWithImages,
            };
          })
        );

        // Send the modified response
        res.send(assessmentWithImages);

        //   res.json(CheckAssessment);
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

router.get("/getpuchasedlist", authenticateToken, async (req, res, next) => {
  console.log("PuchaseList");
  try {
    if (req.user.id) {
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
router.post("/", async (req, res, next) => {
  console.log("first of post request to purchaselist");
  console.log("Body: " + JSON.stringify(req.body));

  const AgentConfigFetch = await prisma.Configuration.findUnique({
    where: { id: "53962976-afd5-4c1a-b612-decb5fd1eeeb" },
  });
  const agentCommisionPercent = parseFloat(AgentConfigFetch.agentCommisionRate);
  console.log("Commision in percent: " + agentCommisionPercent);

  let StudentId = "000";
  let PackageId = "000";

  StudentId = req.body.dataToSend.studentId;
  console.log("First studentId : " + StudentId);

  PackageId = req.body.dataToSend.packageId;
  console.log("First packageid : " + PackageId);
  const PayedAmount = req.body.dataToSend.amount;
  const PromoCode = req.body.dataToSend.promocode;

  console.log("amount payed: " + req.body.dataToSend.amount);
  const paymentForAgent =
    (parseFloat(PayedAmount) * agentCommisionPercent) / 100;
  console.log("Payment for Agent: " + paymentForAgent);

  try {
    const UserDetails = await prisma.Students.findFirst({
      where: { accountType: "Agent", promocode: PromoCode },
    });
    if (UserDetails.id) {
      const UpdateAgentPayment = await prisma.Students.update({
        where: {
          id: UserDetails.id,
        },
        data: {
          balance: (
            parseFloat(UserDetails.balance) + paymentForAgent
          ).toString(),
        },
      });
      console.log("Successfuly added money to agent");
    } else {
      console.log("No Agent Found");
    }
  } catch (e) {
    console.log("Seems Like no Agent found");
  }

  try {
    if (StudentId) {
      const UserDetails = await prisma.Students.findUnique({
        where: { id: StudentId },
      });

      if (UserDetails) {
        console.log("First point make: " + JSON.stringify(UserDetails));
        if (UserDetails.studentStatus == "active") {
          console.log("code: " + UserDetails.firstName);
          console.log(req.body);
          const purchaseInfo = {
            //PackageId
            packagesId: PackageId,
            name: "x",
            transaction_id: "x",
            method: "santimpay",
            value: "x",
            timeLength: "x",

            studentsId: StudentId,
            expiryDate: new Date(),
            type: "main",
          };
          const alreadyPurchasedInfo = {
            packagesId: PackageId,
            name: "x",
            transaction_id: "x",
            method: "santimpay",
            value: "x",
            timeLength: "x",

            studentsId: StudentId,
            type: "update",
            updatePackageStatus: "on",
          };
          // console.log(x);

          const checkIfPuchasedAlready = await prisma.PurchaseList.findFirst({
            where: {
              studentsId: StudentId,
              packagesId: PackageId,
            },
          });
          //if (checkIfPuchasedAlready) {
          if (!checkIfPuchasedAlready) {
            console.log("Check Point 2: new purchase");
            console.log("my object 001: " + JSON.stringify(purchaseInfo));
            const purchaselist = await prisma.PurchaseList.create({
              data: purchaseInfo,
            });
            console.log("New Purchase List: " + JSON.stringify(purchaselist));
            const addNotificationtoAdmin = await prisma.Notifications.create({
              data: {
                type: "0",

                //studentsId: req.user.id,
                addressedTo: "admin",
                notiHead: `${UserDetails.firstName} ${UserDetails.lastName}  paid for a new package.`,
                notiFull: `${UserDetails.firstName} ${UserDetails.lastName} successfuly paid for new package!`,
                status: "0",
              },
            });
            console.log("uem" + UserDetails.email);
            console.log("FN" + UserDetails.firstName);
            // console.log("ItemName" + req.body.itemName);
            //  console.log("PrizeId" + studentPrizeId);
            console.log("Pre: " + JSON.stringify(purchaselist));

            let purchaselistId;
            if (purchaselist) {
              purchaselistId = purchaselist.id;
              console.log("PurchaaseListId: " + purchaselistId);

              const response = await axios.patch(
                `${localUrl}/purchaselist/filterPurchase/${purchaselistId}`,
                {
                  dateToAdd: 30, // Changed "30" (string) to 30 (number)
                  packageId: PackageId,
                  studentId: StudentId,
                  type: "new",
                }
              );
            }
            let package;
            try {
              //purchaselistId
              if (1 == 1) {
                console.log("purchaseList Recorded: ", purchaselist);
                const returnValue = sendCustomEmail.emailsender(
                  UserDetails.email,
                  UserDetails.firstName,
                  "You have bought a package!",
                  `Your purchase id is [${purchaselist.id}], `
                );

                const addNotification = await prisma.Notifications.create({
                  data: {
                    type: "0",
                    studentsId: StudentId,
                    addressedTo: "s",
                    notiHead: "Purchase Made.",
                    notiFull: `You have successfuly made a purchase with id [${purchaselistId}]!`,
                    status: "0",
                  },
                });
              }

              console.log("this is also printed");
              package = await prisma.Packages.findUnique({
                where: {
                  id: PackageId,
                },
                include: {
                  courses: true,
                },
              });

              console.log("Package List one: " + JSON.stringify(package));

              if (package) {
                console.log("here 2");
                // console.log(package);
                const courseIds = package.courses.map(
                  (course) => course.id,
                  console.log("this"),
                  console.log("Course Item : " + course.id + " " + course.name)
                );

                /////////////////////
                console.log("Course IDs in the package:", courseIds);
                const createStudentCourses = await Promise.all(
                  courseIds.map(async (courseId) => {
                    const checkCourseRepeated =
                      await prisma.StudentCourse.findFirst({
                        where: {
                          studentsId: StudentId,
                          coursesId: courseId,
                        },
                      });
                    if (!checkCourseRepeated) {
                      const createdStudentCourse =
                        await prisma.StudentCourse.create({
                          data: {
                            studentsId: StudentId,
                            coursesId: courseId,
                            packageId: PackageId,
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
            } catch (e) {
              console.log("Error from catch: " + e);
            }
            // res.json(purchaselist);
            res.status(201).json({ message: "success" });
          } else {
            console.log("Check Point 3:  purchase");

            const purchaselist = await prisma.PurchaseList.create({
              data: alreadyPurchasedInfo,
            });

            const addNotificationtoAdmin = await prisma.Notifications.create({
              data: {
                type: "0",

                //studentsId: req.user.id,
                addressedTo: "admin",
                notiHead: `${UserDetails.firstName} ${UserDetails.lastName}  Updated Package.`,
                notiFull: `${UserDetails.firstName} ${UserDetails.lastName} has updated one more month for a package.`,
                status: "0",
              },
            });

            // console.log("ItemName" + req.body.itemName);
            //  console.log("PrizeId" + studentPrizeId);
            const purchaselistId = purchaselist.id;
            console.log("PurchaseListId: " + purchaselistId);
            try {
              const responsex = await axios.patch(
                `${localUrl}/purchaselist/filterPurchase/${purchaselistId}`,
                {
                  dateToAdd: "30", // Changed "30" (string) to 30 (number)
                  packageId: PackageId,
                  studentId: StudentId,
                }
              );
            } catch (error) {
              console.log("Error from catch: " + error);
            }

            console.log("Passed");
            if (purchaselistId) {
              //  console.log("purchaseList Recorded: ", purchaselist);
              const returnValue = sendCustomEmail.emailsender(
                UserDetails.email,
                UserDetails.firstName,
                "You have ordered an update in a package!",
                `Your purchase id is [${purchaselistId}], `,
                ""
              );

              const addNotification = await prisma.Notifications.create({
                data: {
                  type: "0",
                  studentsId: StudentId,
                  addressedTo: "s",
                  notiHead: "Purchase Made.",
                  notiFull: `You have successfuly made a package update with id [${purchaselistId}]!`,
                  status: "0",
                },
              });
            }

            console.log("this is also printed");
            const package = await prisma.Packages.findUnique({
              where: {
                id: PackageId,
              },
              include: {
                courses: true,
              },
            });
            console.log("Package List two: " + JSON.stringify(package));
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
                        studentsId: StudentId,
                        coursesId: courseId,
                      },
                    });
                  if (!checkCourseRepeated) {
                    const createdStudentCourse =
                      await prisma.StudentCourse.create({
                        data: {
                          studentsId: StudentId,
                          coursesId: courseId,
                          packageId: PackageId,
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
      }
    } else {
      res.status(401).json({ message: "failed" });
    }
  } catch (error) {
    return res.status(501);
  }
});

//Update Student
router.patch("/:id", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.user.id },
    });

    if (UserDetails) {
      if (
        UserDetails.accountType == "Admin" ||
        UserDetails.accountType == "Assistant" ||
        UserDetails.accountType == "SubAdmin"
      ) {
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
    }
  } else {
    res.json({ Error: "You dont have access" });
  }
});

//delete Student
router.delete("/:id", authenticateToken, async (req, res, next) => {
  if (req.user.id) {
    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.user.id },
    });

    if (UserDetails) {
      if (
        UserDetails.accountType == "Admin" ||
        UserDetails.accountType == "SubAdmin" ||
        UserDetails.accountType == "Assistant"
      ) {
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
  } else {
    res.json({ Error: "You dont have access" });
  }
});

module.exports = router;
