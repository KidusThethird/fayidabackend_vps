-- CreateTable
CREATE TABLE `CourseUnits` (
    `id` VARCHAR(191) NOT NULL,
    `StudentCourseId` VARCHAR(191) NOT NULL,
    `unitNumber` VARCHAR(191) NULL,
    `status` BOOLEAN NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CourseUnits` ADD CONSTRAINT `CourseUnits_StudentCourseId_fkey` FOREIGN KEY (`StudentCourseId`) REFERENCES `StudentCourse`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
