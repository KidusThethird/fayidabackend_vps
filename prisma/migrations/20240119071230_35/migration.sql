-- AlterTable
ALTER TABLE `package` ADD COLUMN `discountExpriyDate` DATETIME(3) NULL,
    ADD COLUMN `discountStatus` BOOLEAN NULL DEFAULT false,
    ADD COLUMN `temporaryPrice` VARCHAR(191) NULL;
