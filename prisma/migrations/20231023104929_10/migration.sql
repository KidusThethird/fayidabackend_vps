/*
  Warnings:

  - You are about to alter the column `status` on the `package` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `TinyInt`.

*/
-- AlterTable
ALTER TABLE `assesment` MODIFY `assesmentDescription` TEXT NULL;

-- AlterTable
ALTER TABLE `conversations` MODIFY `text` TEXT NULL;

-- AlterTable
ALTER TABLE `package` ADD COLUMN `packageDescription` TEXT NULL,
    MODIFY `status` BOOLEAN NULL DEFAULT false;

-- AlterTable
ALTER TABLE `videos` MODIFY `vidDescription` TEXT NULL;
