const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const express = require("express");
const path = require("path");
const prisma = new PrismaClient();
const checkAuthenticated = require("./login_register.route");

router.use(express.static(path.join(__dirname, "public")));

// Optional: Create a custom endpoint for downloading the APK
router.get("/", (req, res) => {
  // const filePath = path.join(__dirname, "../apk/fayidaapp.apk");
  const filePath = path.join(__dirname, "../apk/fayidamobileapp.apk");
  res.download(filePath, "Fayida Academy App.apk", (err) => {
    if (err) {
      console.error("Error downloading the file:", err);
      res.status(500).send("Error downloading the file.");
    }
  });
});

module.exports = router;
