"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSupplierDTo = exports.createSupplierDTo = void 0;
const zod_1 = require("zod");
exports.createSupplierDTo = zod_1.z.object({
    ruc: zod_1.z.string(),
    business_name: zod_1.z.string(),
    business_type: zod_1.z.string(),
    business_status: zod_1.z.string(),
    business_direction: zod_1.z.string(),
});
exports.updateSupplierDTo = zod_1.z.object({
    ruc: zod_1.z.string(),
    business_name: zod_1.z.string(),
    business_type: zod_1.z.string(),
    business_status: zod_1.z.string(),
    business_direction: zod_1.z.string(),
});
