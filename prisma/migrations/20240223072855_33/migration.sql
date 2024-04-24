-- AlterTable
ALTER TABLE `package` ADD COLUMN `price2` VARCHAR(191) NULL,
    ADD COLUMN `price3` VARCHAR(191) NULL,
    ADD COLUMN `temporaryPrice2` VARCHAR(191) NULL,
    ADD COLUMN `temporaryPrice3` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `studentcourse` ADD COLUMN `expiryDate` DATETIME(3) NULL;
