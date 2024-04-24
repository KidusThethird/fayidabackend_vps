const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const multer = require("multer");
const path = require("path");
const http = require("http");
const cors = require("cors");

var fileNameSaved = "";

const checkAuthenticated = require("./login_register.route");

//working with students

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload_assets/images/paymentmethod_images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    fileNameSaved = (
      "" +
      Date.now() +
      path.extname(file.originalname)
    ).toString();
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

router.get("/upload_paymentmethod_image", async (req, res, next) => {
  //res.send({ message: "Awesome it works" });
  const filePath = path.join(__dirname, "../views", "index.html");
  res.sendFile(filePath);
});

//router.post(
// "/upload_package_thumbnail",
// upload.single("package_image"),
// (req, res) => {
//   res.send(`image Uploaded: ${fileNameSaved}`);
// }
//);

router.post(
  "/upload_paymentmethod_image/:id",
  upload.single("paymentmethod_image"),
  async (req, res) => {
    // ... file upload logic ...

    // Assuming `fileNameSaved` contains the saved file name
    const paymentMethodId = req.params.id; // Assuming the package ID is available in the request parameters
    console.log("Question Id: " + paymentMethodId);
    const options = {
      hostname: "localhost",
      port: 5000, // Replace with the appropriate port number
      path: `/paymentmethods/${paymentMethodId}`,

      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    };

    const request = http.request(options, (response) => {
      let data = "";
      response.on("data", (chunk) => {
        data += chunk;
      });

      response.on("end", () => {
        // Handle the response after the PATCH request is complete
        if (response.statusCode === 200) {
          // res.send(`Image Uploaded: ${fileNameSaved}`);
        } else {
          res.status(500).send("Failed to update package attribute");
        }
      });
    });

    request.on("error", (error) => {
      // Handle the PATCH request error
      res.status(500).send("Failed to update package attribute");
    });

    const Mock = await prisma.PaymentMethods.update({
      where: {
        id: paymentMethodId,
      },
      data: { image: fileNameSaved },
    });
    // const payload = JSON.stringify({ questionImage: fileNameSaved });

    // request.write(payload);
    request.end();
  }
);
{
  /*************************************************************** */
}
{
  /*************************************************************** */
}
{
  /*************************************************************** */
}

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  try {
    const paymentMethods = await prisma.PaymentMethods.findMany({});
    res.json(paymentMethods);
  } catch (error) {
    next(error);
  }
});

//Get one student
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const singlepaymentmethods = await prisma.PaymentMethods.findUnique({
      where: {
        id: id,
      },
    });
    res.json(singlepaymentmethods);
  } catch (error) {
    next(error);
  }
});

//Create a Student
router.post("/", async (req, res, next) => {
  try {
    const paymentMethods = await prisma.PaymentMethods.create({
      data: req.body,
    });
    res.json(paymentMethods);
  } catch (error) {}
});

//Update Student
router.patch("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatePaymentMethod = await prisma.PaymentMethods.update({
      where: {
        id: id,
      },
      data: req.body,
    });
    res.json(updatePaymentMethod);
  } catch (error) {
    next(error);
  }
});

//delete Student
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    deletePaymentMethod = await prisma.PaymentMethods.delete({
      where: {
        id: id,
      },
    });
    res.json(deletePaymentMethod);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
