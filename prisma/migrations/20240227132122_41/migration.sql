-- AlterTable
ALTER TABLE `assesment` ADD COLUMN `thumbnail` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `MockPackage` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL DEFAULT 'untitled',
    `description` VARCHAR(191) NULL DEFAULT '',
    `thumbnail` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL DEFAULT 'free',
    `temporaryPrice` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'inactive',
    `displayHome` BOOLEAN NULL DEFAULT false,
    `discountStatus` BOOLEAN NULL DEFAULT false,
    `discountExpiryDate` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AssesmentToMockPackage` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AssesmentToMockPackage_AB_unique`(`A`, `B`),
    INDEX `_AssesmentToMockPackage_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AssesmentToMockPackage` ADD CONSTRAINT `_AssesmentToMockPackage_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assesment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssesmentToMockPackage` ADD CONSTRAINT `_AssesmentToMockPackage_B_fkey` FOREIGN KEY (`B`) REFERENCES `MockPackage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
