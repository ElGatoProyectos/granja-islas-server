import {
  Bill,
  Company,
  CreditNote,
  DebitNote,
  Ticket,
  User,
} from "@prisma/client";
import { typeDocumentSunat } from "../models/constants/type_document.constant";
import { T_Header } from "../models/types/methods.type";
import BillService from "./bill.service";
import CreditNoteService from "./credit-note.service";
import DebitNoteService from "./debit-note.service";
import ResponseService from "./response.service";
import TicketService from "./ticket.service";
import prisma from "../../infrastructure/database/prisma";
import InfoService from "./info.service";

type T_FindAllNopagination = {
  params: {
    year: number | undefined;
    month: number | undefined;
  };
  header: T_Header;
};

type T_FindAll = {
  params: {
    year: number | undefined;
    month: number | undefined;
    supplier_group_id: string | undefined;
    filter: string | undefined;
  };
  pagination: {
    page: number;
    limit: number;
  };
  header: T_Header;
};

type T_FindDetail = {
  params: {
    document_code: string;
    document_id: number;
  };
  header: T_Header;
};

class DocumentService {
  private billService: BillService = new BillService();
  private ticketService: TicketService = new TicketService();
  private creditNoteService: CreditNoteService = new CreditNoteService();
  private debitNoteService: DebitNoteService = new DebitNoteService();
  private responseService: ResponseService = new ResponseService();
  private infoService: InfoService = new InfoService();

  findAllByAccumulated = async ({ params, header }: T_FindAllNopagination) => {
    const body = {
      year: params.year,
      month: params.month,
    };
    try {
      const responseBillsAccumulated =
        await this.billService.findAllByAccumulated({ body, header });
      if (responseBillsAccumulated.error) return responseBillsAccumulated;

      const responseTicketsAccumulated =
        await this.ticketService.findAllByAccumulated({ body, header });
      if (responseTicketsAccumulated.error) return responseBillsAccumulated;

      const responseCreditNotesAccumulated =
        await this.creditNoteService.findAllByAccumulated({ body, header });
      if (responseCreditNotesAccumulated.error) return responseBillsAccumulated;

      const responseDebitNotesAccumulated =
        await this.debitNoteService.findAllByAccumulated({ body, header });
      if (responseDebitNotesAccumulated.error) return responseBillsAccumulated;

      return this.responseService.SuccessResponse("Reporte acumulado", {
        bills: responseBillsAccumulated.payload,
        tickets: responseTicketsAccumulated.payload,
        creditNotes: responseCreditNotesAccumulated.payload,
        debitNotes: responseDebitNotesAccumulated.payload,
      });
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findAll = async (data: T_FindAll) => {
    try {
      const format = {
        body: data.params,
        header: data.header,
      };

      const skip = (data.pagination.page - 1) * data.pagination.limit;
      const limit = data.pagination.limit;

      const allData = [];

      // Recopilar datos de todos los servicios
      const responseBills = await this.billService.findAll(format);
      if (responseBills.error) return responseBills;
      allData.push(...responseBills.payload);

      const responseTicket = await this.ticketService.findAll(format);
      if (responseTicket.error) return responseTicket;
      allData.push(...responseTicket.payload);

      const responseCreditNotes = await this.creditNoteService.findAll(format);
      if (responseCreditNotes.error) return responseCreditNotes;
      allData.push(...responseCreditNotes.payload);

      const responseDebitNotes = await this.debitNoteService.findAll(format);
      if (responseDebitNotes.error) return responseDebitNotes;
      allData.push(...responseDebitNotes.payload);

      // Obtener el total de registros
      const total = allData.length;
      const pageCount = Math.ceil(total / limit);

      // Aplicar paginación
      const paginatedData = allData.slice(skip, skip + limit);

      // Formatear la respuesta
      const formatData = {
        total,
        page: data.pagination.page,
        limit,
        pageCount,
        data: paginatedData,
      };

      return this.responseService.SuccessResponse(
        "Reporte por tipo de documento",
        formatData
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };

  findDetail = async (data: T_FindDetail) => {
    try {
      const responseInfo = await this.infoService.getCompanyAndUser(
        data.header.token,
        data.header.ruc
      );

      if (responseInfo.error) return responseInfo;

      const { company, user }: { company: Company; user: User } =
        responseInfo.payload;

      const document_code = data.params.document_code;

      let document: Bill | CreditNote | DebitNote | Ticket | null = null;

      if (document_code === typeDocumentSunat.FACTURA.code) {
        document = await prisma.bill.findFirst({
          where: { id: data.params.document_id, company_id: company.id },
          include: { Supplier: true },
        });
      } else if (document_code === typeDocumentSunat.BOLETA_DE_VENTA.code) {
        document = await prisma.ticket.findFirst({
          where: { id: data.params.document_id, company_id: company.id },
          include: { Supplier: true },
        });
      } else if (document_code === typeDocumentSunat.NOTA_DE_CREDITO.code) {
        document = await prisma.creditNote.findFirst({
          where: { id: data.params.document_id, company_id: company.id },
          include: { Supplier: true },
        });
      }

      if (!document)
        return this.responseService.NotFoundException(
          "Documento no encontrado"
        );
      return this.responseService.SuccessResponse(
        "Detalle del documento",
        document
      );
    } catch (error) {
      return this.responseService.InternalServerErrorException(
        undefined,
        error
      );
    }
  };
}

export default DocumentService;
