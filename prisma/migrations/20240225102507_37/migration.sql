/*
  Warnings:

  - You are about to alter the column `expiryDate` on the `purchaselist` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `DateTime(3)`.

*/
-- AlterTable
ALTER TABLE `purchaselist` MODIFY `expiryDate` DATETIME(3) NULL;
