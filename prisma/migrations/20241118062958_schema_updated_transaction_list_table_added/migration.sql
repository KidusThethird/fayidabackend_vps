-- CreateTable
CREATE TABLE `TransactionList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `TransactionId` VARCHAR(191) NULL,
    `amount` VARCHAR(191) NULL,
    `commission` VARCHAR(191) NULL,
    `totalAmount` VARCHAR(191) NULL,
    `currency` VARCHAR(191) NULL,
    `reason` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
