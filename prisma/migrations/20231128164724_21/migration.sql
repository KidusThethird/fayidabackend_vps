/*
  Warnings:

  - Added the required column `packageId` to the `StudentCourse` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `studentcourse` ADD COLUMN `packageId` VARCHAR(191) NOT NULL;
