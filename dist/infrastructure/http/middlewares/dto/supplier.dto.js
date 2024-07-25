"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierDTo = exports.createSupplierDTo = void 0;
const zod_1 = require("zod");
exports.createSupplierDTo = zod_1.z.object({
    ruc: zod_1.z.string().min(11),
    business_name: zod_1.z.string(),
    business_type: zod_1.z.string(),
    business_status: zod_1.z.string(),
    business_direction: zod_1.z.string(),
});
exports.updateSupplierDTo = zod_1.z.object({
    ruc: zod_1.z.string().min(11),
    business_name: zod_1.z.string(),
    business_type: zod_1.z.string(),
    business_status: zod_1.z.string(),
    business_direction: zod_1.z.string(),
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
