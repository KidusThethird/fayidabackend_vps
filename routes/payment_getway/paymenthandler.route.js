const express = require("express");
const router = express.Router();
const crypto = require("crypto");
const authenticateToken = require("../authMiddleware.js");
const { PrismaClient } = require("@prisma/client");


const prisma = new PrismaClient();
// Constants
const PRIVATE_KEY_IN_PEM = `
-----BEGIN EC PRIVATE KEY-----
MHcCAQEEIF1FiolOiNt9VZga7Xv2Hnc9ogec+n17oAC7vtls3fBuoAoGCCqGSM49
AwEHoUQDQgAEEcfE9DYOz/pkenjJ4Abdgr2BsYB5zhh+3RxlHA+ZDlQ63+RTJS2B
A2vqUeASic2BPMd+LqrAlo+5nCLqdBm//g==
-----END EC PRIVATE KEY-----
`;

const GATEWAY_MERCHANT_ID = "9e2dab64-e2bb-4837-9b85-d855dd878d2b";
const successRedirectUrl = "https://fayidaacademy.com/searchPackages";
const failureRedirectUrl = "https://fayidaacademy.com/searchPackages";
const cancelRedirectUrl = "https://fayidaacademy.com/searchPackages";
const notifyUrl = "https://api.fayidaacademy.com/inforeciver/notifyme";


async function  generateRandomId(userId)  {
    // Generate 15 random bytes and convert to base64
    let generatedId= 0;
    console.log("User is sent to generateId: "+userId)
if(userId){

  try {
    const student = await prisma.students.create({
      data: req.body,
    });

    res.json(student);
  } catch (error) {}

    
     generatedId= crypto.randomBytes(15).toString("base64").slice(0, 15);
}
else{
     generatedId= 0;
}


    return generatedId;
  }
  //const randomId = generateRandomId();
// Initialize the SDK dynamically
(async () => {
  try {
    const { default: SantimpaySdk } = await import("../../santimpaysdk/lib/index.js");
    const client = new SantimpaySdk(GATEWAY_MERCHANT_ID, PRIVATE_KEY_IN_PEM);

    // Define routes
    router.get("/", (req, res) => {
      res.render("index.ejs");
    });

    router.get("/complete", (req, res) => {
      res.send("Your payment was successful");
    });

    router.get("/cancel", (req, res) => {
      res.redirect("/");
    });

    router.post("/mynotifyUrl", (req, res) => {
      console.log("Notification received: " + JSON.stringify(req.body));
      res.status(200).json({ message: "Notification processed" });
    });

    router.post("/checkout",authenticateToken, async (req, res) => {

if(req.user.id){

    console.log("Body: "+ JSON.stringify(req.body))

     const UserDetails = await prisma.Students.findUnique({
 
         where: { id: req.user.id },
       
       });
       const PackageDetails = await prisma.Packages.findUnique({
 
         where: { id: req.body.packageId },
       
       });

if(UserDetails && PackageDetails){


      const id = "User021";
     // generateRandomId();
      //const amount = 1; // Replace with actual amount
      const description = PackageDetails.packageName;
    const phoneNumber = req.body.phoneNumber;
    const amount = req.body.price;


      try {
        const url = await client.generatePaymentUrl(
         // id,
         generateRandomId(req.user.id),
         
         amount, 
         description, 
         successRedirectUrl, 
         failureRedirectUrl, 
         notifyUrl, 
         phoneNumber, 
         cancelRedirectUrl
        );

        console.log("Response Payment URL: ", url);
        res.json({ paymentUrl: url });

        setTimeout(async () => {
          console.log("\n\n*********************************");
          console.log("Checking for transaction...");
          try {
            const transaction = await client.checkTransactionStatus(id);
            console.log("Transaction status response: ", transaction);
          } catch (error) {
            console.error("Error checking transaction: ", error);
          }
        }, 20_000);
      } catch (error) {
        console.error("Error generating payment URL: ", error);
        res.status(500).json({ error: "Failed to generate payment URL" });
      }} }
    });
  } catch (error) {
    console.error("Error initializing SDK:", error.message);
  }
})();

module.exports = router;
