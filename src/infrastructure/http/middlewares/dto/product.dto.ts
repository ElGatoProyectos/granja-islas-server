import { z } from "zod";

export const createProductDTO = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  supplier_id: z.number().optional(),
});

export const updateProductDTO = z.object({
  title: z.string(),
  description: z.string().optional(),
  price: z.number(),
  supplier_id: z.number().optional(),
});

// model Product {
//   id          Int     @id @default(autoincrement())
//   title       String
//   description String  @db.Text()
//   price       Float   @db.DoublePrecision
//   slug        String? @db.Text()

//   supplier_id Int?

//   status_deleted Boolean? @default(false)

//   created_at DateTime @default(dbgenerated("CURRENT_DATE"))
//   updated_at DateTime @updatedAt

//   Supplier           Supplier?            @relation(fields: [supplier_id], references: [id])
//   DetailProductLabel DetailProductLabel[]
// }
