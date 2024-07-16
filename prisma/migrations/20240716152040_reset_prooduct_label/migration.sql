/*
  Warnings:

  - A unique constraint covering the columns `[slug]` on the table `Product_Label` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Product_Label` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product_Label" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Product_Label_slug_key" ON "Product_Label"("slug");
