/*
  Warnings:

  - You are about to drop the column `testPaperId` on the `Question` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Question` DROP FOREIGN KEY `Question_testPaperId_fkey`;

-- AlterTable
ALTER TABLE `Question` DROP COLUMN `testPaperId`;

-- CreateTable
CREATE TABLE `Link` (
    `testPaperId` INTEGER NOT NULL,
    `questionId` INTEGER NOT NULL,

    PRIMARY KEY (`testPaperId`, `questionId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_testPaperId_fkey` FOREIGN KEY (`testPaperId`) REFERENCES `TestPaper`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Link` ADD CONSTRAINT `Link_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
