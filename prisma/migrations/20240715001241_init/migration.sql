/*
  Warnings:

  - You are about to drop the column `label_id` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the `Label` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `product_label_id` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_label_id_fkey";

-- AlterTable
ALTER TABLE "Company" ALTER COLUMN "status_enabled" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "label_id",
ADD COLUMN     "product_label_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "status_deleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "role" DROP NOT NULL;

-- DropTable
DROP TABLE "Label";

-- CreateTable
CREATE TABLE "Product_Label" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Product_Label_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_product_label_id_fkey" FOREIGN KEY ("product_label_id") REFERENCES "Product_Label"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
