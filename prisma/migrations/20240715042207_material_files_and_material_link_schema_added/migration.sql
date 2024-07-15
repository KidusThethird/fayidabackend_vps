-- CreateTable
CREATE TABLE `MaterialFile` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `fileDescription` TEXT NULL,
    `course` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `location` VARCHAR(191) NULL,
    `materialId` VARCHAR(191) NULL,

    UNIQUE INDEX `MaterialFile_id_key`(`id`),
    UNIQUE INDEX `MaterialFile_materialId_key`(`materialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MaterialLink` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL,
    `linkDescription` TEXT NULL,
    `course` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `location` VARCHAR(191) NULL,
    `materialId` VARCHAR(191) NULL,

    UNIQUE INDEX `MaterialLink_id_key`(`id`),
    UNIQUE INDEX `MaterialLink_materialId_key`(`materialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MaterialFile` ADD CONSTRAINT `MaterialFile_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MaterialLink` ADD CONSTRAINT `MaterialLink_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
