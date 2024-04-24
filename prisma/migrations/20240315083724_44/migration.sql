-- AlterTable
ALTER TABLE `examtaker` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `examtakermockpackagepurchase` ADD COLUMN `paymentMethod` VARCHAR(191) NULL,
    ADD COLUMN `price` VARCHAR(191) NULL;
