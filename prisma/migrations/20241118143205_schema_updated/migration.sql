-- AlterTable
ALTER TABLE `TransactionIdGenerator` ADD COLUMN `packageId` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `TransactionIdGenerator` ADD CONSTRAINT `TransactionIdGenerator_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `package`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
