/*
  Warnings:

  - You are about to drop the `Badge` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Badge";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "Label" (
    "productHandle" TEXT NOT NULL PRIMARY KEY,
    "labelName" TEXT NOT NULL,
    "labelUrl" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);
