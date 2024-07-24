"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserDTO = exports.createSunatDTO = exports.editUserDTO = exports.createUserDTO = void 0;
const zod_1 = require("zod");
exports.createUserDTO = zod_1.z.object({
    role: zod_1.z.enum(["ADMIN", "USER"]),
    name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email(),
    dni: zod_1.z.string(),
});
exports.editUserDTO = zod_1.z.object({
    role: zod_1.z.enum(["ADMIN", "USER"]),
    name: zod_1.z.string(),
    last_name: zod_1.z.string(),
    phone: zod_1.z.string().optional(),
    email: zod_1.z.string().email().optional(),
    dni: zod_1.z.string(),
});
exports.createSunatDTO = zod_1.z.object({
    ruc: zod_1.z.string(),
    key: zod_1.z.string(),
});
exports.updateUserDTO = exports.createUserDTO.partial();
