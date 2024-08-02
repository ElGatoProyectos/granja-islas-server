export interface I_Document_Item {
  id: string;
  numRuc: string;
  nomRazonSocial: string;
  codCar: string;
  codTipoCDP: string;
  desTipoCDP: string;
  numSerieCDP: string;
  numCDP: string;
  fecEmision: string;
  fecVencPag: null;
  numCDPRangoFinal: null;
  codTipoDocIdentidadProveedor: string;
  numDocIdentidadProveedor: string;
  nomRazonSocialProveedor: string;
  codTipoCarga: string;
  codSituacion: string;
  codMoneda: string;
  codEstadoComprobante: string;
  desEstadoComprobante: string;
  indOperGratuita: string;
  codTipoMotivoNota: string;
  desTipoMotivoNota: null;
  indEditable: null;
  perTributario: string;
  numInconsistencias: number;
  indInfIncompleta: null;
  indModificadoContribuyente: null;
  plazoVisualizacion: null;
  indDetraccion: null;
  indIncluExcluCar: number;
  porParticipacion: null;
  codBbss: string;
  codIdProyecto: null;
  annCDP: null;
  codDepAduanera: null;
  indFuenteCP: string;
  liscodInconsistencia: string[];
  lisNumCasilla: string[];
  porTasaRetencion: null;
  desMsjOriginal: null;
  numCarIndIE: null;
  numCorrelativo: number;
  porTasaIGV: number;
  archivoCarga: null;
  tipoCambio: TipoCambio;
  montos: { [key: string]: number | null };
  lisDocumentosMod: LisDocumentosMod[];
  camposLibres: null;
  auditoria: Auditoria;
}

export interface Auditoria {
  codUsuRegis: string;
  fecRegis: Date;
  codUsuModif: string;
  fecModif: Date;
}

export interface LisDocumentosMod {
  fecEmisionMod: string;
  codTipoCDPMod: string;
  numSerieCDPMod: string;
  numCDPMod: string;
}

export interface TipoCambio {
  indCargaTipoCambio: string;
  mtoCambioMonedaExtranjera: number;
  mtoCambioMonedaDolares: number;
  mtoTipoCambio: number;
}
