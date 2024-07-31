import { Bank } from "@prisma/client";

export interface I_CreateBank
  extends Omit<
    Bank,
    | "id"
    | "created_at"
    | "updated_at"
    | "company_id"
    | "user_created_id"
    | "slug"
  > {}

export interface I_UpdateBank
  extends Omit<
    Bank,
    | "id"
    | "created_at"
    | "updated_at"
    | "company_id"
    | "user_created_id"
    | "slug"
  > {}

// model Bank {
//   id              Int      @id @default(autoincrement()) --
//   company_id      Int
//   user_created_id Int --
//   title           String   ---
//   slug            String?  @unique @db.Text() --
//   description     String?  @db.Text()
//   status_deleted  Boolean? @default(false) --

//   Company Company @relation(fields: [company_id], references: [id])
//   User    User    @relation(fields: [user_created_id], references: [id])
// }
