/*
  Warnings:

  - A unique constraint covering the columns `[agent_email]` on the table `Students` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Students` ADD COLUMN `agent_email` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Students_agent_email_key` ON `Students`(`agent_email`);
