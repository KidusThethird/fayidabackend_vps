/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Students` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Students` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Students_id_key` ON `Students`(`id`);

-- CreateIndex
CREATE UNIQUE INDEX `Students_email_key` ON `Students`(`email`);
