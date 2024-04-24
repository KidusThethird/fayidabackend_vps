-- AlterTable
ALTER TABLE `purchaselist` ADD COLUMN `type` VARCHAR(191) NOT NULL DEFAULT 'default',
    ADD COLUMN `updatePackageStatus` VARCHAR(191) NOT NULL DEFAULT 'pending';
