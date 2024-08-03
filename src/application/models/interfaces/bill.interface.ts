import { Bill } from "@prisma/client";

export interface I_CreateBill
  extends Omit<Bill, "id" | "created_at" | "updated_at"> {}

export interface I_CreateBillFromBody
  extends Omit<
    Bill,
    | "id"
    | "created_at"
    | "updated_at"
    | "company_id"
    | "user_id_created"
    | "igv"
    | "total"
  > {}

// model Bill {
//   id              Int  @id @default(autoincrement()) --
//   company_id      Int? --
//   user_id_created Int? --

//   num_serie   String
//   num_cpe     Int
//   code        String
//   date        DateTime @db.Date
//   period      String
//   igv         Float    @default(0.18)
//   total       Float    @default(0)
//   bill_status String
//   paid        Float    @default(0)
//   earring     Float    @default(0)
//   supplier_id Int?

//   created_at DateTime @default(dbgenerated("CURRENT_DATE"))
//   updated_at DateTime @updatedAt

//   Company  Company?  @relation(fields: [company_id], references: [id])
//   Supplier Supplier? @relation(fields: [supplier_id], references: [id])
// }
