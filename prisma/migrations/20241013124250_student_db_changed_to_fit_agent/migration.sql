-- AlterTable
ALTER TABLE `Students` ADD COLUMN `balance` VARCHAR(191) NULL DEFAULT '0',
    ADD COLUMN `promocode` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `package` ADD COLUMN `removed` BOOLEAN NOT NULL DEFAULT false;
