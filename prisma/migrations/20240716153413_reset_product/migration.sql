-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status_deleted" BOOLEAN DEFAULT false;

-- AlterTable
ALTER TABLE "Product_Label" ALTER COLUMN "status_deleted" SET DEFAULT false;
