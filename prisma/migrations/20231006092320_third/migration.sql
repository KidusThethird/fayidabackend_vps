/*
  Warnings:

  - You are about to drop the column `question` on the `assesment` table. All the data in the column will be lost.
  - You are about to drop the column `packages` on the `courses` table. All the data in the column will be lost.
  - You are about to drop the column `notiTo` on the `notifications` table. All the data in the column will be lost.
  - You are about to drop the column `courses` on the `package` table. All the data in the column will be lost.
  - You are about to drop the column `Package` on the `purchaselist` table. All the data in the column will be lost.
  - You are about to drop the column `Student` on the `purchaselist` table. All the data in the column will be lost.
  - You are about to drop the column `choise` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `course` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the column `questionTest` on the `questions` table. All the data in the column will be lost.
  - You are about to drop the `_packagetostudents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `choises` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[choicesId]` on the table `Questions` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `packagesId` to the `PurchaseList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `studentsId` to the `PurchaseList` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assesmentId` to the `Questions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_packagetostudents` DROP FOREIGN KEY `_packagetostudents_A_fkey`;

-- DropForeignKey
ALTER TABLE `_packagetostudents` DROP FOREIGN KEY `_packagetostudents_B_fkey`;

-- AlterTable
ALTER TABLE `assesment` DROP COLUMN `question`;

-- AlterTable
ALTER TABLE `audios` ADD COLUMN `videosId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `courses` DROP COLUMN `packages`;

-- AlterTable
ALTER TABLE `languages` ADD COLUMN `videosId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `notifications` DROP COLUMN `notiTo`,
    ADD COLUMN `addressedTo` VARCHAR(191) NULL,
    ADD COLUMN `notiLink` VARCHAR(191) NULL,
    ADD COLUMN `studentsId` VARCHAR(191) NULL,
    ADD COLUMN `type` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `package` DROP COLUMN `courses`;

-- AlterTable
ALTER TABLE `purchaselist` DROP COLUMN `Package`,
    DROP COLUMN `Student`,
    ADD COLUMN `packagesId` VARCHAR(191) NOT NULL,
    ADD COLUMN `studentsId` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `questions` DROP COLUMN `choise`,
    DROP COLUMN `course`,
    DROP COLUMN `questionTest`,
    ADD COLUMN `assesmentId` VARCHAR(191) NOT NULL,
    ADD COLUMN `choicesId` VARCHAR(191) NULL,
    ADD COLUMN `questionType` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `students` ADD COLUMN `email` VARCHAR(191) NULL,
    ADD COLUMN `password` VARCHAR(191) NULL,
    ADD COLUMN `phoneNumber` VARCHAR(191) NULL,
    ADD COLUMN `prefferdLanguage` VARCHAR(191) NULL,
    ADD COLUMN `profilePicture` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_packagetostudents`;

-- DropTable
DROP TABLE `choises`;

-- CreateTable
CREATE TABLE `Materials` (
    `id` VARCHAR(191) NOT NULL,
    `materialIndex` INTEGER NOT NULL,
    `materialType` VARCHAR(191) NULL,
    `coursesId` VARCHAR(191) NOT NULL,
    `videosId` VARCHAR(191) NULL,
    `assesmentId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Choices` (
    `id` VARCHAR(191) NOT NULL,
    `choiseA` VARCHAR(191) NULL,
    `choiseB` VARCHAR(191) NULL,
    `choiseC` VARCHAR(191) NULL,
    `choiseD` VARCHAR(191) NULL,
    `correctChoice` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Choices_id_key`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Forum` (
    `id` VARCHAR(191) NOT NULL,
    `coursesId` VARCHAR(191) NULL,

    UNIQUE INDEX `Forum_coursesId_key`(`coursesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conversations` (
    `id` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NULL,
    `mentionedStudent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `forumId` VARCHAR(191) NULL,
    `studentsId` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CoursesToPackages` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CoursesToPackages_AB_unique`(`A`, `B`),
    INDEX `_CoursesToPackages_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Questions_choicesId_key` ON `Questions`(`choicesId`);

-- AddForeignKey
ALTER TABLE `PurchaseList` ADD CONSTRAINT `PurchaseList_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseList` ADD CONSTRAINT `PurchaseList_packagesId_fkey` FOREIGN KEY (`packagesId`) REFERENCES `package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materials` ADD CONSTRAINT `Materials_coursesId_fkey` FOREIGN KEY (`coursesId`) REFERENCES `Courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materials` ADD CONSTRAINT `Materials_videosId_fkey` FOREIGN KEY (`videosId`) REFERENCES `Videos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materials` ADD CONSTRAINT `Materials_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `Assesment`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Audios` ADD CONSTRAINT `Audios_videosId_fkey` FOREIGN KEY (`videosId`) REFERENCES `Videos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `Assesment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_choicesId_fkey` FOREIGN KEY (`choicesId`) REFERENCES `Choices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Languages` ADD CONSTRAINT `Languages_videosId_fkey` FOREIGN KEY (`videosId`) REFERENCES `Videos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forum` ADD CONSTRAINT `Forum_coursesId_fkey` FOREIGN KEY (`coursesId`) REFERENCES `Courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_forumId_fkey` FOREIGN KEY (`forumId`) REFERENCES `Forum`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CoursesToPackages` ADD CONSTRAINT `_CoursesToPackages_A_fkey` FOREIGN KEY (`A`) REFERENCES `Courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CoursesToPackages` ADD CONSTRAINT `_CoursesToPackages_B_fkey` FOREIGN KEY (`B`) REFERENCES `package`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
