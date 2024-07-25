"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCredentialsDTO = void 0;
const zod_1 = require("zod");
exports.validateCredentialsDTO = zod_1.z.object({
    ruc: zod_1.z.string().min(11),
    user: zod_1.z.string(),
    key: zod_1.z.string(),
});
