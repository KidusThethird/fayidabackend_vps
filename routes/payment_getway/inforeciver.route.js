const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");
const { localUrl } = require("../../configFIles");
const axios = require("axios");



const prisma = new PrismaClient();
//const checkAuthenticated = require("./login_register.route");

//working with students

//Get all student
router.get("/", async (req, res, next) => {
  //  res.send("Welcome to Node Route Test")
  console.log("Get Request : Inforeciver")
  res.send({"info ":"getway"})
});

router.get("/transactionlist", async (req, res, next) => {
  try {
    const blogs = await prisma.TransactionList.findMany({
      orderBy: {
        createdAt: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
      },
    });
    res.json(blogs);
  } catch (error) {
    next(error);
  }
});
// router.get("/transactionlist/:id", async (req, res, next) => {
//   try {
//     const transaction = await prisma.TransactionList.findMany({
//       orderBy: {
//         createdAt: "asc", // Replace 'asc' with 'desc' if you want to sort in descending order
//       },
//       where:{
//         id: parseInt(req.params.id)
//       }
//     });

//     let TransactionIdFetched;
// if(transaction){

//    TransactionIdFetched = await prisma.TransactionIdGenerator.findMany({
//    include:{
//     Student:true
//    },
//     where:{
//       generatedId: transaction.TransactionId
//     }
//   });

// }

// if(TransactionIdFetched){

// }

// res.json({
//   ...TransactionIdFetched,
//   ...transaction,
// });
//   } catch (error) {
//     next(error);
//   }
// });
router.get("/transactionlist/:id", async (req, res, next) => {
  try {
    // Fetch TransactionList entries for the given id
    const transactionList = await prisma.TransactionList.findMany({
      where: {
        id: parseInt(req.params.id),
      },
      orderBy: {
        createdAt: "asc", // Sort transactions
      },
    });

    // Collect TransactionId values from TransactionList
    const transactionIds = transactionList.map((transaction) => transaction.TransactionId);

    // Fetch corresponding TransactionIdGenerator entries
    const transactionIdGenerators = await prisma.TransactionIdGenerator.findMany({
      where: {
        generatedId: {
          in: transactionIds,
        },
      },
      include: {
        Student: true, // Include related Student data
      },
    });

    // Map TransactionIdGenerator data to each TransactionList entry
    const combinedData = transactionList.map((transaction) => {
      const relatedTransaction = transactionIdGenerators.find(
        (generator) => generator.generatedId === transaction.TransactionId
      );

      return {
        ...transaction,
        TransactionIdGenerator: relatedTransaction || null, // Add the related data or null
      };
    });

    // Respond with the combined data
    res.json(combinedData);
  } catch (error) {
    next(error); // Handle errors
  }
});



router.post('/notifyme',async (req, res) => {
   // console.log('Received POST request:', req.body); // Log the request body

const response = req.body;
const acceptedId = req.body.thirdPartyId

console.log("Is ThirdPartyId matching expected value?:", req.body.thirdPartyId == "yq5oSwXBuI4JQGF");


console.log("acceptedId: "+ acceptedId)
    for (const [key, value] of Object.entries(response)) {
      console.log(`${key}: ${value}`);
    }


    if(req.body.Status == "CANCELLED"){
      const transaction = await prisma.TransactionList.create({
        data: {
          TransactionId : req.body.thirdPartyId,
  amount        :req.body.amount,
  commission    : req.body.commission,
  totalAmount   : req.body.totalAmount,
  currency      : req.body.currency,
  reason        : req.body.reason,
  phoneNumber   : req.body.msisdn,
  status        :req.body.Status
        },
      });
      
      
      console.log("The Process is Cancelled!")
    }else if(req.body.Status == "COMPLETED"){

      //restore this

      const transaction = await prisma.TransactionList.create({
        data: {
          TransactionId : req.body.thirdPartyId,
  amount        :req.body.amount,
  commission    : req.body.commission,
  totalAmount   : req.body.totalAmount,
  currency      : req.body.currency,
  reason        : req.body.reason,
  phoneNumber   : req.body.msisdn,
  status        :req.body.Status
        },
      });


  // const  UserDetails= await prisma.TransactionIdGenerator.findFirst({
 
  //   where: { generatedId: req.body.thirdPartyId },
   
  // });

  
let thirdParty = req.body.thirdPartyId

  
  const UserDetails = await prisma.TransactionIdGenerator.findFirst({
    where: {
      generatedId:thirdParty , // Ensure `req.body.thirdPartyId` exists
    },
  });
  console.log("Working on it...")
  console.log("UserDetails: "+JSON.stringify(UserDetails))
 console.log("Generated key: "+req.body.thirdPartyId)



if(UserDetails){

  console.log("User Fetched: "+ UserDetails);


      const dataToSend = {
        "studentId": UserDetails.studentId,
        "packageId": UserDetails.packageId
        
      };


      try {

        const response = await axios.post(`${localUrl}/purchaselist`, {
          dataToSend,
        });
        //console.log("Code: " + x.status);

        // const response = await axios.post(`${localUrl}/purchaselist`, dataToSend);
       // console.log("Response from /target-route:", response.data);
    
        // Send the response back to the client
        // res.json({
        //   success: true,
        //   message: "Request to target-route completed successfully",
        //   targetResponse: response.data,
        // });
        console.log("Resoponse accepted")
      } catch (error) {
        console.error("Error during POST request:", error);
        res.status(500).json({
          success: false,
          message: error,
        });
      }


    }
      console.log("The Process is Completed!")
    }else {
      console.log("The Process is Failed!")
    }


  //  res.status(200).json(req.body); // Send the received JSON data as response
});
module.exports = router;
