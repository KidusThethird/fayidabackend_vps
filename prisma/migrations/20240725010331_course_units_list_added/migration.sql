-- CreateTable
CREATE TABLE `CourseUnitsList` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `CourseId` VARCHAR(191) NOT NULL,
    `UnitNumber` INTEGER NULL,
    `Title` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseUnitsList` ADD CONSTRAINT `CourseUnitsList_CourseId_fkey` FOREIGN KEY (`CourseId`) REFERENCES `Courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
