-- CreateTable
CREATE TABLE `PaymentMethods` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'active',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
