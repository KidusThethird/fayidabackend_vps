-- CreateTable
CREATE TABLE `Students` (
    `id` VARCHAR(191) NOT NULL,
    `accountType` VARCHAR(191) NOT NULL DEFAULT 'Student',
    `accountPrivilege` VARCHAR(191) NOT NULL DEFAULT 'none',
    `firstName` VARCHAR(191) NULL,
    `lastName` VARCHAR(191) NULL,
    `grandName` VARCHAR(191) NULL,
    `age` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sectionId` VARCHAR(191) NULL,
    `studentStatus` VARCHAR(191) NULL DEFAULT 'down',
    `gread` VARCHAR(191) NULL,
    `schoolName` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `code` VARCHAR(191) NULL DEFAULT '1136',
    `email` VARCHAR(191) NULL,
    `password` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `profilePicture` VARCHAR(191) NULL,
    `prefferdLanguage` VARCHAR(191) NULL,
    `points` VARCHAR(191) NULL DEFAULT '0',
    `message` VARCHAR(191) NULL DEFAULT '',
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    UNIQUE INDEX `Students_id_key`(`id`),
    UNIQUE INDEX `Students_email_key`(`email`),
    INDEX `Students_sectionId_fkey`(`sectionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamTaker` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `grade` VARCHAR(191) NULL,
    `region` VARCHAR(191) NULL,
    `gender` VARCHAR(191) NULL,
    `city` VARCHAR(191) NULL,
    `school` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `scienceType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamTakerMockPackagePurchase` (
    `id` VARCHAR(191) NOT NULL,
    `examTakerId` VARCHAR(191) NULL,
    `mockPackageId` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NULL,
    `phoneNumber` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NULL DEFAULT 'pending',
    `name` VARCHAR(191) NULL,
    `transaction_id` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Sections` (
    `id` VARCHAR(191) NOT NULL,
    `index` INTEGER NULL,
    `sectionName` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    UNIQUE INDEX `Sections_sectionName_key`(`sectionName`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cityName` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Region` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `index` INTEGER NULL,
    `regionName` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PackageFolder` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `folderName` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `index` INTEGER NULL,
    `parent` VARCHAR(191) NULL,
    `layer` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `package` (
    `id` VARCHAR(191) NOT NULL,
    `packageName` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL,
    `price2` VARCHAR(191) NULL,
    `price3` VARCHAR(191) NULL,
    `temporaryPrice` VARCHAR(191) NULL,
    `temporaryPrice2` VARCHAR(191) NULL,
    `temporaryPrice3` VARCHAR(191) NULL,
    `discountStatus` BOOLEAN NULL DEFAULT false,
    `discountExpriyDate` DATETIME(3) NULL,
    `status` BOOLEAN NULL DEFAULT false,
    `displayOnHome` BOOLEAN NULL DEFAULT false,
    `thumbnail` VARCHAR(191) NULL,
    `trailer` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `packageDescription` TEXT NULL,
    `sectionsId` VARCHAR(191) NULL,
    `group` VARCHAR(191) NULL,
    `group2` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `MockPackage` (
    `id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NULL DEFAULT 'untitled',
    `description` TEXT NULL,
    `thumbnail` VARCHAR(191) NULL,
    `price` VARCHAR(191) NULL DEFAULT 'free',
    `temporaryPrice` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'inactive',
    `displayHome` BOOLEAN NULL DEFAULT false,
    `discountStatus` BOOLEAN NULL DEFAULT false,
    `discountExpiryDate` DATETIME(3) NULL,
    `group` VARCHAR(191) NULL,
    `group2` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentCourse` (
    `id` VARCHAR(191) NOT NULL,
    `coursesId` VARCHAR(191) NOT NULL,
    `studentsId` VARCHAR(191) NOT NULL,
    `packageId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'default',
    `progress` VARCHAR(191) NULL DEFAULT '0',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `expiryDate` DATETIME(3) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentAssessement` (
    `id` VARCHAR(191) NOT NULL,
    `assessmentId` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `Score` VARCHAR(191) NULL,
    `CorrectAnswers` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PurchaseList` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL DEFAULT 'default',
    `updatePackageStatus` VARCHAR(191) NOT NULL DEFAULT 'off',
    `paymentStatus` VARCHAR(191) NULL DEFAULT 'pending',
    `name` VARCHAR(191) NULL,
    `method` VARCHAR(191) NULL,
    `value` VARCHAR(191) NULL,
    `transaction_id` VARCHAR(191) NULL,
    `purchaseType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `studentsId` VARCHAR(191) NOT NULL,
    `packagesId` VARCHAR(191) NOT NULL,
    `activatedDate` DATETIME(3) NULL,
    `timeLength` VARCHAR(191) NULL,
    `expiryDate` DATETIME(3) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Courses` (
    `id` VARCHAR(191) NOT NULL,
    `courseName` VARCHAR(191) NULL,
    `courseDescription` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `parts` VARCHAR(191) NULL DEFAULT '1',
    `partName` VARCHAR(191) NULL,
    `courseIntroductionVideo` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Materials` (
    `id` VARCHAR(191) NOT NULL,
    `materialIndex` INTEGER NOT NULL,
    `materialType` VARCHAR(191) NULL,
    `part` VARCHAR(191) NULL DEFAULT '1',
    `coursesId` VARCHAR(191) NOT NULL,
    `assesmentId` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Videos` (
    `id` VARCHAR(191) NOT NULL,
    `vidTitle` VARCHAR(191) NULL,
    `vidDescription` TEXT NULL,
    `course` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `location` VARCHAR(191) NULL,
    `materialId` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    UNIQUE INDEX `Videos_id_key`(`id`),
    UNIQUE INDEX `Videos_materialId_key`(`materialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Assesment` (
    `id` VARCHAR(191) NOT NULL,
    `assessmentType` VARCHAR(191) NOT NULL DEFAULT 'in-course',
    `assesmentIndex` INTEGER NULL,
    `assesmentTitle` VARCHAR(191) NULL,
    `assesmentDescription` TEXT NULL,
    `course` VARCHAR(191) NULL,
    `assesmentPoints` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `materialId` VARCHAR(191) NULL,
    `duration` VARCHAR(191) NOT NULL DEFAULT '30',
    `thumbnail` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    UNIQUE INDEX `Assesment_materialId_key`(`materialId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Audios` (
    `id` VARCHAR(191) NOT NULL,
    `languages` VARCHAR(191) NULL,
    `video` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `videosId` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Questions` (
    `id` VARCHAR(191) NOT NULL,
    `questionIndex` VARCHAR(191) NULL,
    `questionType` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `assesmentId` VARCHAR(191) NOT NULL,
    `choiseA` VARCHAR(191) NULL,
    `choiseB` VARCHAR(191) NULL,
    `choiseC` VARCHAR(191) NULL,
    `choiseD` VARCHAR(191) NULL,
    `correctChoice` VARCHAR(191) NULL,
    `question` VARCHAR(191) NULL,
    `correction` TEXT NULL,
    `questionImage` VARCHAR(191) NULL,
    `correctionImage` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Languages` (
    `id` VARCHAR(191) NOT NULL,
    `shortForm` VARCHAR(191) NULL,
    `fullForm` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `videosId` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notifications` (
    `notiId` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NULL,
    `addressedTo` VARCHAR(191) NULL,
    `notiHead` VARCHAR(191) NULL,
    `notiFull` TEXT NULL,
    `notiLink` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NULL DEFAULT 'new',
    `studentsId` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`notiId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Forum` (
    `id` VARCHAR(191) NOT NULL,
    `coursesId` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    UNIQUE INDEX `Forum_coursesId_key`(`coursesId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Conversations` (
    `id` VARCHAR(191) NOT NULL,
    `text` TEXT NULL,
    `mentionedStudent` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `forumId` VARCHAR(191) NULL,
    `studentsId` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Blogs` (
    `id` VARCHAR(191) NOT NULL,
    `blogIndex` INTEGER NOT NULL DEFAULT 0,
    `displayOnHome` VARCHAR(191) NOT NULL DEFAULT 'false',
    `writtenBy` VARCHAR(191) NULL,
    `title` TEXT NULL,
    `subTitle` TEXT NULL,
    `text` TEXT NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Books` (
    `id` VARCHAR(191) NOT NULL,
    `index` INTEGER NULL DEFAULT 0,
    `title` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,
    `description` TEXT NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PaymentMethods` (
    `id` VARCHAR(191) NOT NULL,
    `index` INTEGER NULL DEFAULT 0,
    `name` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NULL,
    `accountNumber` VARCHAR(191) NULL,
    `status` VARCHAR(191) NULL DEFAULT 'active',
    `image` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Messages` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `Text` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `status` VARCHAR(191) NOT NULL DEFAULT 'new',
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prize` (
    `id` VARCHAR(191) NOT NULL,
    `prizeIndex` INTEGER NULL DEFAULT 0,
    `itemName` VARCHAR(191) NULL DEFAULT 'Prize Item',
    `itemDecription` TEXT NULL,
    `points` VARCHAR(191) NULL DEFAULT '0',
    `visibleAtPoint` VARCHAR(191) NULL DEFAULT '0',
    `visiblity` VARCHAR(191) NULL DEFAULT 'inactive',
    `image` VARCHAR(191) NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `StudentPrize` (
    `id` VARCHAR(191) NOT NULL,
    `prizeId` VARCHAR(191) NOT NULL,
    `studentsId` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NULL DEFAULT 'pending',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Advertisement` (
    `id` VARCHAR(191) NOT NULL,
    `advertisementIndex` INTEGER NULL DEFAULT 0,
    `displayOnHome` VARCHAR(191) NOT NULL DEFAULT 'false',
    `title` VARCHAR(191) NULL,
    `subtitle` VARCHAR(191) NULL,
    `text` TEXT NULL,
    `subtext` TEXT NULL,
    `info` VARCHAR(191) NULL,
    `type` VARCHAR(191) NULL,
    `image` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Collection` (
    `id` VARCHAR(191) NOT NULL,
    `field1` VARCHAR(191) NULL,
    `field2` VARCHAR(191) NULL,
    `field3` VARCHAR(191) NULL,
    `field4` VARCHAR(191) NULL,
    `field5` INTEGER NULL,
    `field6` BOOLEAN NOT NULL,
    `field7` TEXT NULL,
    `extra1` VARCHAR(191) NULL,
    `extra2` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CoursesToPackages` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_CoursesToPackages_AB_unique`(`A`, `B`),
    INDEX `_CoursesToPackages_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_AssesmentToMockPackage` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AssesmentToMockPackage_AB_unique`(`A`, `B`),
    INDEX `_AssesmentToMockPackage_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Students` ADD CONSTRAINT `Students_sectionId_fkey` FOREIGN KEY (`sectionId`) REFERENCES `Sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamTakerMockPackagePurchase` ADD CONSTRAINT `ExamTakerMockPackagePurchase_mockPackageId_fkey` FOREIGN KEY (`mockPackageId`) REFERENCES `MockPackage`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamTakerMockPackagePurchase` ADD CONSTRAINT `ExamTakerMockPackagePurchase_examTakerId_fkey` FOREIGN KEY (`examTakerId`) REFERENCES `ExamTaker`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `package` ADD CONSTRAINT `package_sectionsId_fkey` FOREIGN KEY (`sectionsId`) REFERENCES `Sections`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentCourse` ADD CONSTRAINT `StudentCourse_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentCourse` ADD CONSTRAINT `StudentCourse_coursesId_fkey` FOREIGN KEY (`coursesId`) REFERENCES `Courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentCourse` ADD CONSTRAINT `StudentCourse_packageId_fkey` FOREIGN KEY (`packageId`) REFERENCES `package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAssessement` ADD CONSTRAINT `StudentAssessement_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentAssessement` ADD CONSTRAINT `StudentAssessement_assessmentId_fkey` FOREIGN KEY (`assessmentId`) REFERENCES `Assesment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseList` ADD CONSTRAINT `PurchaseList_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `PurchaseList` ADD CONSTRAINT `PurchaseList_packagesId_fkey` FOREIGN KEY (`packagesId`) REFERENCES `package`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Materials` ADD CONSTRAINT `Materials_coursesId_fkey` FOREIGN KEY (`coursesId`) REFERENCES `Courses`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Videos` ADD CONSTRAINT `Videos_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assesment` ADD CONSTRAINT `Assesment_materialId_fkey` FOREIGN KEY (`materialId`) REFERENCES `Materials`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Audios` ADD CONSTRAINT `Audios_videosId_fkey` FOREIGN KEY (`videosId`) REFERENCES `Videos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Questions` ADD CONSTRAINT `Questions_assesmentId_fkey` FOREIGN KEY (`assesmentId`) REFERENCES `Assesment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Languages` ADD CONSTRAINT `Languages_videosId_fkey` FOREIGN KEY (`videosId`) REFERENCES `Videos`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notifications` ADD CONSTRAINT `Notifications_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Forum` ADD CONSTRAINT `Forum_coursesId_fkey` FOREIGN KEY (`coursesId`) REFERENCES `Courses`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Conversations` ADD CONSTRAINT `Conversations_forumId_fkey` FOREIGN KEY (`forumId`) REFERENCES `Forum`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPrize` ADD CONSTRAINT `StudentPrize_studentsId_fkey` FOREIGN KEY (`studentsId`) REFERENCES `Students`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `StudentPrize` ADD CONSTRAINT `StudentPrize_prizeId_fkey` FOREIGN KEY (`prizeId`) REFERENCES `Prize`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CoursesToPackages` ADD CONSTRAINT `_CoursesToPackages_A_fkey` FOREIGN KEY (`A`) REFERENCES `Courses`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CoursesToPackages` ADD CONSTRAINT `_CoursesToPackages_B_fkey` FOREIGN KEY (`B`) REFERENCES `package`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssesmentToMockPackage` ADD CONSTRAINT `_AssesmentToMockPackage_A_fkey` FOREIGN KEY (`A`) REFERENCES `Assesment`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AssesmentToMockPackage` ADD CONSTRAINT `_AssesmentToMockPackage_B_fkey` FOREIGN KEY (`B`) REFERENCES `MockPackage`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
