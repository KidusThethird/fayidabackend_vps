-- CreateTable
CREATE TABLE `agentTransaction` (
    `id` VARCHAR(191) NOT NULL,
    `promocode` VARCHAR(191) NOT NULL,
    `value` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'paid',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
