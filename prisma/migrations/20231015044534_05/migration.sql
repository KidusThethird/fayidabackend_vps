-- DropIndex
DROP INDEX `Materials_assesmentId_fkey` ON `materials`;

-- AlterTable
ALTER TABLE `assesment` ADD COLUMN `assesmentDescription` VARCHAR(191) NULL,
    ADD COLUMN `assesmentTitle` VARCHAR(191) NULL;
