require("dotenv").config();

const express = require("express");
const createError = require("http-errors");
const morgan = require("morgan");
require("dotenv").config();
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const app = express();

const telegramRoute = require("./routes/botroute/main.route.js");

//telegram file started
// const telegramBot = require("node-telegram-bot-api");
// const TELEGRAMTOKEN = "8050365014:AAFUX3yYC2Op_00G9sCjaANBR2H6NgTs6bw";

// const bot = new telegramBot(TELEGRAMTOKEN, { polling: true });

// bot.on("message", (message) => {
//   console.log("Message: " + message.text);
//   console.log("Message Id: " + message.from.id);
//   bot.sendMessage(message.from.id, "Hello from NodeJs");
// });

//telegram file end

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

//app.use(cors());

app.disable("etag");
const uploadsDirectory = path.join(__dirname, "upload_assets");

const checkAuthenticated = require("./routes/login_register.route");
const checkNotAuthenticated = require("./routes/login_register.route");

app.use(cors({ credentials: true, origin: true }));
//app.use(cors({ credentials: true, origin: `${homeWebUrl}` }));

app.use("/", require("./routes/api.route"));

app.use("/analysis", require("./routes/analysis.route"));
app.use("/agenttransaction", require("./routes/agenttransaction.route"));

app.use("/students", checkAuthenticated, require("./routes/students.route"));
app.use("/sections", require("./routes/sections.route"));
app.use("/courses", require("./routes/courses.route"));
app.use(
  "/courseintroductionvideo",
  require("./routes/courseintroductionvideos.route")
);
app.use("/agents", require("./routes/agents.route"));

app.use("/packages", require("./routes/packages.route"));
app.use("/purchaselist", require("./routes/purchaselist.route"));
app.use("/conversations", require("./routes/conversations.route"));
app.use("/notifications", require("./routes/notifications.route"));
app.use("/forums", require("./routes/forums.route"));
app.use("/materials", require("./routes/materials.route"));
app.use("/videos", require("./routes/videos.route"));
app.use("/audios", require("./routes/audios.route"));
app.use("/languages", require("./routes/languages.route"));
app.use("/blogs", require("./routes/blogs.route"));
app.use("/assesments", require("./routes/assesments.route"));
app.use("/questions", require("./routes/questions.route"));
app.use("/choices", require("./routes/choices.route"));
app.use("/mailer", require("./routes/mailsend.route"));
app.use("/test", require("./routes/test.route"));
app.use("/paymentmethods", require("./routes/paymentmethods.route"));
app.use("/messages", require("./routes/messages.route"));
app.use("/prizes", require("./routes/prizes.route"));
app.use("/studentassessments", require("./routes/studentassessments.route"));
//app.use("/login", require("./routes/login.route"));
app.use("/login_register", require("./routes/login_register.route"));
app.use("/leaderboard", require("./routes/leaderboard.route"));
app.use("/advertisment", require("./routes/advertisment.route"));
app.use("/studentprize", require("./routes/studentprize.route"));
app.use("/region", require("./routes/region.route"));
app.use("/city", require("./routes/city.route"));

app.use("/pacakgefolder", require("./routes/packagefolders.route"));
app.use("/dashboarddata", require("./routes/dashboarddatafetch.route"));
app.use("/mockexampackage", require("./routes/mockexampackage.route"));

app.use("/materiallink", require("./routes/materiallink.route"));
app.use("/materialfiles", require("./routes/material_files.route"));

app.use("/studentcourse", require("./routes/studentscourse.route"));
app.use("/courseunits", require("./routes/courseunits.route"));
app.use("/studentmaterial", require("./routes/studentmaterial.route"));
app.use("/packagereview", require("./routes/packagereview.route"));
app.use("/courseunitslist", require("./routes/courseunitslist.route"));
app.use(
  "/categorylist",
  require("./routes/category_route/catagorieslist.route")
);
app.use(
  "/categoryfolders",
  require("./routes/category_route/categoryfolders.route")
);

app.use("/keywordslist", require("./routes/category_route/keywordslist.route"));

app.use(
  "/questionimageupload",
  require("./routes/questionimageuploader.route")
);
app.use(
  "/correctionimageupload",
  require("./routes/questioncorrectionimageuploader.route")
);
app.use(
  "/mockexampackagepurchase",
  require("./routes/mockpackagepurchaselist.route")
);
app.use("/examtaker", require("./routes/examtakers.route"));
app.use(
  "packageexpirydatesetter",
  require("./routes/coassistant/packageExpirydateSetter")
);

app.use("/upload_assets/", express.static(uploadsDirectory));
app.use((req, res, next) => {
  next(createError.NotFound());
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
