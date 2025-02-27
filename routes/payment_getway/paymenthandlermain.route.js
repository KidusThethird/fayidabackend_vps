const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const authenticateToken = require("../authMiddleware");
const { PrismaClient } = require("@prisma/client");
const axios = require("axios");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const prisma = new PrismaClient();

const PRIVATE_KEY_IN_PEM = process.env.PRIVATE_KEY_IN_PEM;

//const GATEWAY_MERCHANT_ID = "f49e4215-3ade-4d37-be5d-fb0051d44571";

const GATEWAY_MERCHANT_ID = process.env.GATEWAY_MERCHANT_ID;
console.log("Merchant: " + GATEWAY_MERCHANT_ID);

const successRedirectUrl = "https://fayidaacademy.com/searchPackages";
const failureRedirectUrl = "https://fayidaacademy.com/searchPackages";
const cancelRedirectUrl = "https://fayidaacademy.com/searchPackages";
const notifyUrl = "https://api.fayidaacademy.com/inforeciver/notifyme";

function generateRandomId(userId, packageId) {
  // Generate 15 random bytes and convert to base64
  let generatedId = 0;
  console.log("User is sent to generateId: " + userId);
  if (userId) {
    generatedId = crypto.randomBytes(15).toString("base64").slice(0, 15);

    updateDb(userId, generatedId, packageId);
  } else {
    generatedId = 0;
  }

  return generatedId;
}

async function updateDb(userid, generatedid, packageId) {
  const transaction = await prisma.TransactionIdGenerator.create({
    data: {
      studentId: userid,
      generatedId: generatedid,
      packageId: packageId,
    },
  });

  console.log("Id gen: " + generatedid);
}

function generateSignedToken(amount, paymentReason) {
  const time = Math.floor(Date.now() / 1000); // Current time in seconds
  console.log(
    "Amount recived: " + amount,
    "Reason: " +
      paymentReason +
      "merchantId: " +
      GATEWAY_MERCHANT_ID +
      "Time: " +
      time
  );
  const payload = {
    amount: amount,
    // amount: "1", // Ensure consistent formatting
    paymentReason, // Ensure consistent casing
    merchantId: GATEWAY_MERCHANT_ID, // Use the correct merchantId
    generated: time,
  };

  // Sign the payload with the private key using ES256
  console.log("PrivateKey: " + PRIVATE_KEY_IN_PEM);
  console.log(
    "Returned Signed Token: " +
      jwt.sign(payload, PRIVATE_KEY_IN_PEM, { algorithm: "ES256" })
  );
  return jwt.sign(payload, PRIVATE_KEY_IN_PEM, { algorithm: "ES256" });
}

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  res.send({ message: "main payment handler" });
});

router.post("/mynotifyUrl", (req, res) => {
  console.log("Notification received: " + JSON.stringify(req.body));
  res.status(200).json({ message: "Notification processed" });
});

router.post("/checkout", authenticateToken, async (req, res) => {
  if (req.user.id) {
    console.log("Body: " + JSON.stringify(req.body));

    const UserDetails = await prisma.Students.findUnique({
      where: { id: req.user.id },
    });
    const PackageDetails = await prisma.Packages.findUnique({
      where: { id: req.body.packageId },
    });

    if (UserDetails && PackageDetails) {
      const description = PackageDetails.packageName;
      const phoneNumber = req.body.phoneNumber;
      const amount = req.body.price.toString();

      try {
        console.log("I am printed again");

        const postData = async () => {
          console.log("Post Data Started");
          console.log("Amount: " + amount);
          const url =
            "https://services.santimpay.com/api/v1/gateway/initiate-payment"; // Replace with your API endpoint
          const payload = {
            id: generateRandomId(req.user.id, req.body.packageId),
            reason: description,
            amount: "1",
            //amount: amount,
            merchantId: GATEWAY_MERCHANT_ID,
            //signedToken: generateSignedToken("1", description),
            signedToken: generateSignedToken(amount, description),

            successRedirectUrl: successRedirectUrl,
            failureRedirectUrl: failureRedirectUrl,
            cancelRedirectUrl: cancelRedirectUrl,
            phoneNumber: phoneNumber,
            notifyUrl: notifyUrl,
          }; // Replace with your payload

          try {
            console.log(
              "I have reached to post the payload: SignedTOken: " +
                generateSignedToken(1, description) +
                " and RandomId: " +
                generateRandomId(req.user.id, req.body.packageId)
            );
            const response = await axios.post(url, payload);
            console.log("Response:", response.data);
            res.json({ paymentUrl: response.data.url });
          } catch (error) {
            console.error("Error from catch:", error);
          }
        };

        postData();

        //console.log("Post Data Response: "+postData())
        //  console.log("Response Payment URL: ", url);
      } catch (error) {
        console.error("Error generating payment URL: ", error);
        res.status(500).json({ error: "Failed to generate payment URL" });
      }
    }
  }
});

module.exports = router;
