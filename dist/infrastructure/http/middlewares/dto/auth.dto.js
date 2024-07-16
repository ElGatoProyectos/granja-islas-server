"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtDecodeDTO = exports.authDTO = void 0;
const zod_1 = require("zod");
exports.authDTO = zod_1.z.object({
    credential: zod_1.z.string(),
    password: zod_1.z.string(),
});
exports.jwtDecodeDTO = zod_1.z.object({
    id: zod_1.z.number(),
    role: zod_1.z.enum(["SUPERADMIN", "ADMIN", "USER"]),
    full_name: zod_1.z.string(),
    iat: zod_1.z.number().optional(),
    exp: zod_1.z.number().optional(),
});
