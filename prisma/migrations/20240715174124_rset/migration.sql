/*
  Warnings:

  - You are about to drop the column `status_enabled` on the `Company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Company" DROP COLUMN "status_enabled",
ADD COLUMN     "status_deleted" BOOLEAN DEFAULT true;
