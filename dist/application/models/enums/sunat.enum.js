"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EBillPaymentType = exports.EBillDetailType = void 0;
var EBillDetailType;
(function (EBillDetailType) {
    EBillDetailType["EMITIDO"] = "EMITIDO";
    EBillDetailType["RECIBIDO"] = "RECIBIDO";
})(EBillDetailType || (exports.EBillDetailType = EBillDetailType = {}));
var EBillPaymentType;
(function (EBillPaymentType) {
    EBillPaymentType["FACTURA"] = "FACTURA";
    EBillPaymentType["BOLETA_DE_VENTA"] = "BOLETA_DE_VENTA";
    EBillPaymentType["LIQUIDACION_DE_COMPRA"] = "LIQUIDACION_DE_COMPRA";
    EBillPaymentType["NOTA_DE_CREDITO"] = "NOTA_DE_CREDITO";
    EBillPaymentType["NOTA_DE_DEBITO"] = "NOTA_DE_DEBITO";
    EBillPaymentType["RECIBO_POR_HONORARIOS"] = "RECIBO_POR_HONORARIOS";
    EBillPaymentType["NOTA_DE_CREDITO_DE_RECIBOS"] = "NOTA_DE_CREDITO_DE_RECIBOS";
})(EBillPaymentType || (exports.EBillPaymentType = EBillPaymentType = {}));
