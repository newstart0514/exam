-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `from` VARCHAR(191) NOT NULL,
    `studentId` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `isInterviewer` BOOLEAN NOT NULL DEFAULT false,
    `isAdmin` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TestPaper` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `paperCode` VARCHAR(191) NOT NULL,
    `paperName` VARCHAR(191) NOT NULL,
    `paperTime` VARCHAR(191) NOT NULL,
    `desc` TEXT NOT NULL,
    `createAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Question` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `qaTitle` VARCHAR(191) NOT NULL,
    `qaContent` VARCHAR(191) NULL,
    `qaDesc` VARCHAR(191) NULL,
    `qaType` VARCHAR(191) NOT NULL,
    `score` INTEGER NOT NULL,
    `testPaperId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ExamAnswer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `answer` TEXT NOT NULL,
    `qaId` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Answer` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `answer` TEXT NOT NULL,
    `result` VARCHAR(191) NOT NULL,
    `qaId` INTEGER NOT NULL,
    `userId` INTEGER NOT NULL,
    `createAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Question` ADD CONSTRAINT `Question_testPaperId_fkey` FOREIGN KEY (`testPaperId`) REFERENCES `TestPaper`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ExamAnswer` ADD CONSTRAINT `ExamAnswer_qaId_fkey` FOREIGN KEY (`qaId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_qaId_fkey` FOREIGN KEY (`qaId`) REFERENCES `Question`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Answer` ADD CONSTRAINT `Answer_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
