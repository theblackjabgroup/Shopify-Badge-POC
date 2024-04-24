/*
  Warnings:

  - You are about to drop the column `badgeName` on the `Badge` table. All the data in the column will be lost.
  - You are about to drop the column `badgeUrl` on the `Badge` table. All the data in the column will be lost.
  - Added the required column `labelName` to the `Badge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `labelUrl` to the `Badge` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Badge" (
    "productHandle" TEXT NOT NULL PRIMARY KEY,
    "labelName" TEXT NOT NULL,
    "labelUrl" TEXT NOT NULL,
    "shop" TEXT NOT NULL
);
INSERT INTO "new_Badge" ("productHandle", "shop") SELECT "productHandle", "shop" FROM "Badge";
DROP TABLE "Badge";
ALTER TABLE "new_Badge" RENAME TO "Badge";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
