import { Company } from "@prisma/client";

export interface I_UpdateCompany
  extends Omit<
    Company,
    "id" | "status_enabled" | "created_at" | "updated_at"
  > {}

export interface I_CreateCompany
  extends Omit<
    Company,
    "id" | "status_enabled" | "created_at" | "updated_at"
  > {}

// model Company {
//   id                        Int      @id @default(autoincrement())
//   business_name             String
//   business_type             String?
//   business_status           String?
//   business_direction_fiscal String?
//   phone                     String?
//   country_code              String?
//   ruc                       String   @unique
//   key                       String
//   status_deleted            Boolean? @default(false)

//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt
// }
