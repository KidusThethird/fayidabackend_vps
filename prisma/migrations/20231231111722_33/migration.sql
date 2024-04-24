/*
  Warnings:

  - You are about to drop the column `part` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `materials` ADD COLUMN `part` VARCHAR(191) NULL DEFAULT '1';

-- AlterTable
ALTER TABLE `videos` DROP COLUMN `part`;
