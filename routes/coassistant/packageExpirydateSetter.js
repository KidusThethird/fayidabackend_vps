const router = require("express").Router();
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const checkAuthenticated = require("../login_register.route");

const cron = require("node-cron");

//The following code will check each purchase's expirydate,
// and if the date passes it will expire the payment status
//this runs once in 24 hours at mid night

cron.schedule("0 0 * * *", async () => {
  console.log("*******Purchase Expirydate Status Check Started!*******");
  try {
    const data = await prisma.PurchaseList.findMany({
      where: { type: "main" },
    }); // Replace 'tableName' with the actual name of your table

    for (const item of data) {
      // Perform your condition check and patch operation here

      var ExpiryDate = new Date(item.expiryDate); // Convert expiryDate to Date object
      var CurrentDate = new Date();
      var remainingTime = ExpiryDate.getTime() - CurrentDate.getTime();
      var remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

      if (ExpiryDate) {
        if (ExpiryDate < CurrentDate) {
          console.log(
            "Exp: " + ExpiryDate + "Remaining Days: " + remainingDays
          );
          const updatedItem = await prisma.PurchaseList.update({
            where: { id: item.id }, // Assuming 'id' is the primary key of the table
            data: {
              paymentStatus: "Expired",
            },
          });
          console.log(`Updated item with ID ${updatedItem.id}`);
        } else {
          const updatedItem = await prisma.PurchaseList.update({
            where: { id: item.id }, // Assuming 'id' is the primary key of the table
            data: {
              paymentStatus: "active",
            },
          });
          console.log(
            "Good: " + ExpiryDate + "Remaining Days: " + remainingDays
          );
        }
      } else {
        const updatedItem = await prisma.PurchaseList.update({
          where: { id: item.id }, // Assuming 'id' is the primary key of the table
          data: {
            paymentStatus: "pending",
          },
        });
        console.log("Set to Pending");
      }
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }
  console.log("******Purchase Expirydate Status Check Ended!*****");
});

//this code will check expriy date of the course package discount,
// and if the date is over it will set the status of discount to false
// this runs once in 24 hours one hour after mid night

cron.schedule("0 1 * * *", async () => {
  console.log("*****Course Pakcage Discount Status Check Started!******");
  try {
    const DiscountedPackages = await prisma.Packages.findMany({
      where: { discountStatus: true },
    }); // Replace 'tableName' with the actual name of your table

    for (const item of DiscountedPackages) {
      // Perform your condition check and patch operation here

      var ExpiryDate = new Date(item.discountExpriyDate); // Convert expiryDate to Date object
      var CurrentDate = new Date();
      var remainingTime = ExpiryDate.getTime() - CurrentDate.getTime();
      var remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

      if (ExpiryDate) {
        if (ExpiryDate < CurrentDate) {
          console.log(
            "Exp: " + ExpiryDate + "Remaining Days: " + remainingDays
          );
          const updatedItem = await prisma.Packages.update({
            where: { id: item.id }, // Assuming 'id' is the primary key of the table
            data: {
              discountStatus: false,
            },
          });
          console.log(`Updated item with ID ${updatedItem.id}`);
        } else {
          console.log(
            `${item.packageName} Discount ExpiryDate has remaingng days.`
          );
        }
      } else {
        const updatedItem = await prisma.Packages.update({
          where: { id: item.id }, // Assuming 'id' is the primary key of the table
          data: {
            discountStatus: false,
          },
        });
        console.log(
          "Active disount with no expiry Date has been set, so status changed to off!"
        );
      }
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }

  console.log("*****Course Pakcage Discount Status Check Ended!*****");
});

//this code will check expriy date of the mock package discount,
// and if the date is over it will set the status of discount to false
// this runs once in 24 hours two hours after mid night

cron.schedule("0 2 * * *", async () => {
  console.log("******Mock Pakcage Discount Status Check Started!******");
  try {
    const DiscountedPackages = await prisma.MockPackage.findMany({
      where: { discountStatus: true },
    }); // Replace 'tableName' with the actual name of your table

    for (const item of DiscountedPackages) {
      // Perform your condition check and patch operation here

      var ExpiryDate = new Date(item.discountExpiryDate); // Convert expiryDate to Date object
      var CurrentDate = new Date();
      var remainingTime = ExpiryDate.getTime() - CurrentDate.getTime();
      var remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));

      if (ExpiryDate) {
        if (ExpiryDate < CurrentDate) {
          console.log(
            "Exp: " + ExpiryDate + "Remaining Days: " + remainingDays
          );
          const updatedItem = await prisma.MockPackage.update({
            where: { id: item.id }, // Assuming 'id' is the primary key of the table
            data: {
              discountStatus: false,
            },
          });
          console.log(`Updated item with ID ${updatedItem.id}`);
        } else {
          console.log(`${item.title} Discount ExpiryDate has remaingng days.`);
        }
      } else {
        const updatedItem = await prisma.MockPackage.update({
          where: { id: item.id }, // Assuming 'id' is the primary key of the table
          data: {
            discountStatus: false,
          },
        });
        console.log(
          "Active disount with no expiry Date has been set, so status changed to off!"
        );
      }
    }
  } catch (error) {
    console.error("Error updating data:", error);
  }

  console.log("********Mock Pakcage Discount Status Check Ended!********");
});

module.exports = router;
