import { z } from "zod";

export const registerVoucherDTO = z.object({
  operation_number: z.string(),
  type_currency: z.string(),
  phone: z.string().optional(),
  email: z.string().email(),
});

// model Voucher {
//   id               Int          @id @default(autoincrement())
//   bank_id          Int
//   bill_id          Int
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
