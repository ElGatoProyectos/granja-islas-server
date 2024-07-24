"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRuc = exports.updateCompanyDTO = exports.createCompanyDTO = void 0;
const zod_1 = require("zod");
exports.createCompanyDTO = zod_1.z.object({
    business_name: zod_1.z.string(),
    business_type: zod_1.z.string().optional(),
    business_status: zod_1.z.string().optional(),
    business_direction_fiscal: zod_1.z.string().optional(),
    business_user: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    country_code: zod_1.z.string().optional(),
    ruc: zod_1.z.string(),
    key: zod_1.z.string(),
});
exports.updateCompanyDTO = zod_1.z.object({
    business_name: zod_1.z.string(),
    business_type: zod_1.z.string().optional(),
    business_status: zod_1.z.string().optional(),
    business_direction_fiscal: zod_1.z.string().optional(),
    business_user: zod_1.z.string().optional(),
    phone: zod_1.z.string().optional(),
    country_code: zod_1.z.string().optional(),
    ruc: zod_1.z.string(),
    key: zod_1.z.string(),
});
exports.validateRuc = zod_1.z.object({
    ruc: zod_1.z.string().min(11),
});
