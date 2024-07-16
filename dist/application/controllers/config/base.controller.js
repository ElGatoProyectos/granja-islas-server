"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseController {
    constructor() {
        this.autoBind();
    }
    autoBind() {
        const prototype = Object.getPrototypeOf(this);
        Object.getOwnPropertyNames(prototype).forEach((key) => {
            const value = this[key];
            if (key !== "constructor" && typeof value === "function") {
                this[key] = value.bind(this);
            }
        });
    }
}
exports.default = BaseController;
