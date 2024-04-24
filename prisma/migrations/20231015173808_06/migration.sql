/*
  Warnings:

  - You are about to drop the column `choicesId` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `choices` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `questions` DROP FOREIGN KEY `Questions_choicesId_fkey`;

-- AlterTable
ALTER TABLE `questions` DROP COLUMN `choicesId`,
    ADD COLUMN `choiseA` VARCHAR(191) NULL,
    ADD COLUMN `choiseB` VARCHAR(191) NULL,
    ADD COLUMN `choiseC` VARCHAR(191) NULL,
    ADD COLUMN `choiseD` VARCHAR(191) NULL,
    ADD COLUMN `correctChoice` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `choices`;
