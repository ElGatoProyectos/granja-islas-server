"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDateTime = void 0;
//todo recibir anio mes y dia
function convertToDateTime(date) {
    const newDate = new Date(date);
    newDate.setUTCHours(0, 0, 0, 0);
    return newDate;
}
exports.convertToDateTime = convertToDateTime;
