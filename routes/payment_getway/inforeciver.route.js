const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
//const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  //  res.send("Welcome to Node Route Test")
  console.log("Get Request : Inforeciver")
  res.send({"info ":"getway"})
});
router.post('/notifyme', (req, res) => {
   // console.log('Received POST request:', req.body); // Log the request body

const response = req.body;

    for (const [key, value] of Object.entries(response)) {
      console.log(`${key}: ${value}`);
    }


    if(req.body.Status == "CANCELLED"){

      console.log("The Process is Cancelled!")
    }else if(req.body.Status == "COMPLETED"){
      console.log("The Process is Completed!")
    }else {
      console.log("The Process is Failed!")
    }


    res.status(200).json(req.body); // Send the received JSON data as response
});
module.exports = router;
