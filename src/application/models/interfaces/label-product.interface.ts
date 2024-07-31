import { ProductLabel } from "@prisma/client";

export interface I_CreateLabel
  extends Omit<
    ProductLabel,
    "id" | "status_deleted" | "company_id" | "user_created_id" | "slug"
  > {}

export interface I_UpdateLabel
  extends Omit<
    ProductLabel,
    "id" | "status_deleted" | "company_id" | "user_created_id"
  > {}

// model ProductLabel {
//   id             Int      @id @default(autoincrement())
//   title          String
//   slug           String?  @unique @db.Text()
//   description    String?  @db.Text()
//   status_deleted Boolean? @default(false)

//   DetailProductLabel DetailProductLabel[]
// }
