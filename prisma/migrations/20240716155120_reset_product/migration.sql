-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_product_label_id_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "product_label_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_product_label_id_fkey" FOREIGN KEY ("product_label_id") REFERENCES "Product_Label"("id") ON DELETE SET NULL ON UPDATE CASCADE;
