const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const multer = require("multer");
const path = require("path");
const http = require("http");
const cors = require("cors");
const generateUniqueRandomNumber = require("./helper/generaterandomnumberfromdate");

var fileNameSaved = "";

const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

//working with students
console.log("I am running");
var RandomNumber;
var RandomNumberFullForm;

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "upload_assets/images/correction_images");
  },
  filename: (req, file, cb) => {
    console.log(file);
    console.log("this is printed then");
    //  fileNameSaved = RandomNumber.toString();
    //  cb(null, Date.now() + path.extname(file.originalname));
    RandomNumber = generateUniqueRandomNumber();
    const fileName = `${RandomNumber}${path.extname(file.originalname)}`;
    RandomNumberFullForm =
      RandomNumber.toString() + path.extname(file.originalname);
    console.log("path: " + path.extname(file.originalname));
    cb(null, fileName);
  },
});
const upload = multer({ storage: storage });

router.get("/upload_correction_image", async (req, res, next) => {
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
router.post("/upload_correction_image/:id", (req, res, next) => {
  upload.single(req.params.id)(req, res, async (err) => {
    if (err) {
      // Handle the error
      return;
    }

    // File upload logic

    const questionId = req.params.id;
    console.log("Question Id: " + questionId);
    console.log("RandomNumber2: " + RandomNumberFullForm);

    const Mock = await prisma.Questions.update({
      where: {
        id: questionId,
      },
      data: { correctionImage: RandomNumberFullForm },
    });

    // ... continue with the rest of the code ...
  });
});

{
  /*********************************************************** */
}
{
  /*********************************************************** */
}
{
  /*********************************************************** */
}
{
  /*********************************************************** */
}

module.exports = router;
