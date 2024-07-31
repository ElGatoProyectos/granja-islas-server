import { z } from "zod";

export const createSupplierDTo = z.object({
  ruc: z.string().min(11),
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction: z.string(),
  phone: z.string(),
  country_code: z.string(),
});

export const updateSupplierDTo = z.object({
  ruc: z.string().min(11),
  business_name: z.string(),
  business_type: z.string(),
  business_status: z.string(),
  business_direction: z.string(),
  phone: z.string(),
  country_code: z.string(),
});

// model Supplier {
//   id                 Int      @id @default(autoincrement())
//   company_id         Int
//   user_id_created    Int?
//   business_name      String
//   business_type      String
//   business_status    String
//   business_direction String
//   description        String?
//   ruc                String   @unique
//   status_deleted     Boolean? @default(false)

//   created_at DateTime  @default(dbgenerated("CURRENT_DATE"))
//   updated_at DateTime  @updatedAt
//   Product    Product[]
//   Pill       Pill[]

//   Company Company @relation(fields: [company_id], references: [id])
//   User    User?   @relation(fields: [user_id_created], references: [id])
// }
