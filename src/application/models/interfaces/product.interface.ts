import { Product } from "@prisma/client";

export interface I_CreateProduct
  extends Omit<
    Product,
    "id" | "status_deleted" | "created_at" | "updated_at"
  > {}
export interface I_UpdateProduct
  extends Omit<
    Product,
    "id" | "status_deleted" | "created_at" | "updated_at"
  > {}

// model Product {
//   id               Int     @id @default(autoincrement())
//   title            String
//   description      String
//   price            Decimal
//   slug             String? @unique @db.Text()
//   product_label_id Int?
// supplier_id      Int?

//   status_deleted Boolean? @default(false)

//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt

//   Label    Product_Label? @relation(fields: [product_label_id], references: [id])
//   Supplier Supplier       @relation(fields: [supplier_id], references: [id])
// }
