-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_supplier_id_fkey";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "supplier_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_supplier_id_fkey" FOREIGN KEY ("supplier_id") REFERENCES "Supplier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
