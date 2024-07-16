import { Supplier } from "@prisma/client";

export interface I_CreateSupplier
  extends Omit<Supplier, "id" | "created_at" | "updated_at"> {}

export interface I_UpdateSupplier
  extends Omit<Supplier, "id" | "created_at" | "updated_at"> {}

// model Supplier {
//   id                 Int    @id @default(autoincrement())
//   business_name      String
//   ruc                String
//   business_type      String
//   business_status    String
//   business_direction String

//   created_at DateTime  @default(now())
//   updated_at DateTime  @updatedAt
//   Product    Product[]
//   Pill       Pill[]
// }
