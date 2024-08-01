import { Voucher } from "@prisma/client";
import { E_Status } from "../enums/voucher.enum";

export interface I_CreateVoucher
  extends Omit<
    Voucher,
    | "id"
    | "bill_id"
    | "company_id"
    | "user_id_created"
    | "created_at"
    | "updated_at"
  > {}

export interface I_UpdateVoucher
  extends Omit<
    Voucher,
    | "id"
    | "bill_id"
    | "company_id"
    | "user_id_created"
    | "created_at"
    | "updated_at"
  > {}

export interface I_StatusVoucher {
  status: E_Status;
}
// model Voucher {
//   id               Int          @id @default(autoincrement())
//   bank_id          Int
//   bill_id          Int  //esto viene por los params
//   company_id       Int
//   user_id_created  Int?
//   operation_number String
//   amount           Float
//   type_currency    TypeCurrency
//   date             DateTime     @default(now()) @db.Date
//   status_deleted   Boolean      @default(false)

//   Bank    Bank    @relation(fields: [bank_id], references: [id])
//   Bill    Bill    @relation(fields: [bill_id], references: [id])
//   Company Company @relation(fields: [company_id], references: [id])
//   User    User?   @relation(fields: [user_id_created], references: [id])
// }
