import { Product } from "@prisma/client";

export interface I_CreateProduct
  extends Omit<
    Product,
    "id" | "status_deleted" | "created_at" | "updated_at" | "slug"
  > {}

export interface I_CreateProductWithSlug
  extends Omit<
    Product,
    "id" | "status_deleted" | "created_at" | "updated_at"
  > {}
export interface I_UpdateProduct
  extends Omit<
    Product,
    "id" | "status_deleted" | "created_at" | "updated_at"
  > {}

// model Product {
//   id               Int     @id @default(autoincrement())
//   title            String
//   description      String
//   price            Decimal
//   slug             String? @unique @db.Text()
//   product_label_id Int?
// supplier_id      Int?

//   status_deleted Boolean? @default(false)

//   created_at DateTime @default(now())
//   updated_at DateTime @updatedAt

//   Label    Product_Label? @relation(fields: [product_label_id], references: [id])
//   Supplier Supplier       @relation(fields: [supplier_id], references: [id])
// }

export interface I_ResponseDetail {
  datosEmisor: DatosEmisor;
  datosReceptor: DatosReceptor;
  codCpe: string;
  numSerie: string;
  numCpe: number;
  numCpeHasta: number;
  codMoneda: string;
  placaVehicular: string;
  fecEmision: string;
  fecRegistro: string;
  codTipTransaccion: string;
  indEstadoCpe: string;
  indProcedencia: string;
  indTituloGratuito: string;
  mtoVentaOpGratuita: number;
  desMtoTotalLetras: string;
  indItinerante: string;
  indTaxFree: string;
  desObservacion: string;
  informacionItems: InformacionItem[];
  procedenciaMasiva: ProcedenciaMasiva;
  numCpeRel: number;
}
interface ProcedenciaMasiva {
  mtoDtoGlobalAfecBI: number;
  mtoTotalValVentaGrabado: number;
  mtoTotalValVentaInafecto: number;
  mtoTotalValVentaExonerado: number;
  mtoTotalValVentaGratuito: number;
  mtoTotalValVentaExportacion: number;
  mtoDtoGlobalNoAfecBI: number;
  mtoTotalDtos: number;
  mtoSumOtrosTributos: number;
  mtoSumOtrosCargos: number;
  mtoSumISC: number;
  mtoSumIGV: number;
  mtoSumICBPER: number;
  mtoTotalAnticipo: number;
  mtoImporteTotal: number;
  mtoRedondeo: number;
}
export interface InformacionItem {
  cntItems: number;
  codUnidadMedida: string;
  desUnidadMedida: string;
  desCodigo: string;
  desItem: string;
  mtoValUnitario: number;
  mtoICBPER: number;
  mtoDesc: number;
  mtoImpTotal: number;
}
interface DatosReceptor {
  codDocIdeRecep: string;
  numDocIdeRecep: string;
  desRazonSocialRecep: string;
  dirDetCliente: string;
  dirDetRecepFactura: string;
}
interface DatosEmisor {
  numRuc: string;
  desRazonSocialEmis: string;
  desNomComercialEmis: string;
  desDirEmis: string;
  ubigeoEmis: string;
}
