/*
  Warnings:

  - You are about to drop the `section` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `students` DROP FOREIGN KEY `Students_sectionId_fkey`;

-- DropTable
DROP TABLE `section`;

-- CreateTable
CREATE TABLE `Sections` (
    `id` VARCHAR(191) NOT NULL,
    `sectionName` VARCHAR(191) NULL,

    UNIQUE INDEX `Sections_sectionName_key`(`sectionName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Students` ADD CONSTRAINT `Students_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
