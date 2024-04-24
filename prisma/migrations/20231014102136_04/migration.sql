/*
  Warnings:

  - You are about to drop the column `videosId` on the `materials` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[materialId]` on the table `Assesment` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[id]` on the table `Videos` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[materialId]` on the table `Videos` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `materials` DROP FOREIGN KEY `Materials_assesmentId_fkey`;

-- DropForeignKey
ALTER TABLE `materials` DROP FOREIGN KEY `Materials_videosId_fkey`;

-- DropIndex
DROP INDEX `Materials_materialIndex_key` ON `materials`;

-- AlterTable
ALTER TABLE `assesment` ADD COLUMN `materialId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `materials` DROP COLUMN `videosId`;

-- AlterTable
ALTER TABLE `videos` ADD COLUMN `location` VARCHAR(191) NULL,
    ADD COLUMN `materialId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Assesment_materialId_key` ON `Assesment`(`materialId`);

-- CreateIndex
CREATE UNIQUE INDEX `Videos_id_key` ON `Videos`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Videos_materialId_key` ON `Videos`(`materialId`);

-- AddForeignKey
ALTER TABLE `Videos` ADD CONSTRAINT `Videos_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assesment` ADD CONSTRAINT `Assesment_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
