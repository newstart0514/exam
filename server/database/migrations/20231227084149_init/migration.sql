/*
  Warnings:

  - You are about to drop the `adminOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `completeLink` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `completeLink` DROP FOREIGN KEY `completeLink_testPaperId_fkey`;

-- DropForeignKey
ALTER TABLE `completeLink` DROP FOREIGN KEY `completeLink_userId_fkey`;

-- DropTable
DROP TABLE `adminOption`;

-- DropTable
DROP TABLE `completeLink`;

-- CreateTable
CREATE TABLE `CompleteLink` (
    `testPaperId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,

    PRIMARY KEY (`testPaperId`, `userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AdminOption` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CompleteLink` ADD CONSTRAINT `CompleteLink_testPaperId_fkey` FOREIGN KEY (`testPaperId`) REFERENCES `TestPaper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CompleteLink` ADD CONSTRAINT `CompleteLink_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
