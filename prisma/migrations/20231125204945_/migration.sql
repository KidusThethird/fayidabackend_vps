-- AlterTable
ALTER TABLE `purchaselist` ADD COLUMN `method` VARCHAR(191) NULL,
    ADD COLUMN `name` VARCHAR(191) NULL,
    ADD COLUMN `transaction_id` VARCHAR(191) NULL,
    ADD COLUMN `value` VARCHAR(191) NULL;
