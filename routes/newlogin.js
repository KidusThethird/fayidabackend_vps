require('dotenv').config()
const router = require("express").Router();
//add this
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require("@prisma/client");
const authenticateToken = require("./authMiddleware");



const prisma = new PrismaClient();


//const cors = require("cors");
router.use(express.json())

 

router.get("/", authenticateToken, async (req, res, next) => {
  try {
    const Student = await prisma.Students.findUnique({
      where:{id: req.user.id}
    });
   
    console.log("Body: "+JSON.stringify(req.user))
   
    res.json(Student);
  } catch (error) {
    next(error);
  }
});


router.get("/profile", authenticateToken, async (req, res, next) => {
  console.log("Profile: "+ req.user.id)
  try {
    const Student = await prisma.Students.findUnique({
      where:{id: req.user.id}
    });
   
    console.log("Body: "+JSON.stringify(req.user))
   if(Student){
    res.json(Student);} else {
      res.json({"message": "User not authenticated"})
    }
  } catch (error) {
    next(error);
  }
});

router.post('/login', async (req, res) => {
    
    try {

        //authentication started
      const student = await prisma.Students.findFirst({
        where: {
          email: req.body.email,
        },
      });
      
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
      if(student){
        if(await bcrypt.compare(req.body.password , student.password)){
            console.log("Logged in successfully!");


//authorization start

const fetchedStudent = { id: student.id}
const accessToken = jwt.sign(fetchedStudent, process.env.ACCESS_TOKEN_SECRET)
res.json({accessToken: accessToken})

//authorization end



           // return res.status(200).json({ message: "Login successful" });
        }else{
            console.log("Not logged in");
            res.send('Not allowed')
        }
      }
        //authentication end




      
     // res.json(student);
    } catch (error) {
        console.log("Error from catch: "+ error);
      res.status(500).json({ message: 'Server error', error });
    }
  });


//   function authenticateToken(req, res, next){
//     const authHeader = req.headers ['authorization']
//     const token =authHeader&& authHeader.split(' ')[1]
    
// console.log("Auth section is in")
//     if(token == null) return res.sendStatus(401)

//      jwt.verify(token, process.env.ACCESS_TOKEN_SECRET , (err, user)=>{
//         if(err) return res.sendStatus(403);
//         console.log("User: "+ JSON.stringify(user))
//         req.user =user
//         next()

//      })   
//     //Bearer TOKEn =
//   }

module.exports = router;
