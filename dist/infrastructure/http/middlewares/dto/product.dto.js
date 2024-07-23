"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProductDTO = exports.createProductDTO = void 0;
const zod_1 = require("zod");
exports.createProductDTO = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number(),
    supplier_id: zod_1.z.number().optional(),
});
exports.updateProductDTO = zod_1.z.object({
    title: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    price: zod_1.z.number(),
    supplier_id: zod_1.z.number().optional(),
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
