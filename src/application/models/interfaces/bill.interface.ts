import { Bill } from "@prisma/client";
import { I_CreateProduct } from "./product.interface";

export interface I_CreateBill
  extends Omit<
    Bill,
    | "id"
    | "created_at"
    | "updated_at"
    | "document_code"
    | "document_description"
  > {}

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
    | "bill_status"
    | "num_serie"
    | "num_cpe"
    | "bill_status_payment"
    | "base_amount"
  > {
  bill_status_payment: string;
  products: T_ProductInBill[];
}

export interface T_ProductInBill {
  title: string;
  description?: string;
  amount: number;
  price: number;
  currency_code: string;
  unit_measure: string;
  supplier_id?: number;
}

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
