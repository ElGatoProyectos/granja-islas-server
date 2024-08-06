import { T_Header } from "../models/types/methods.type";
import BillService from "./bill.service";
import CreditNoteService from "./credit-note.service";
import DebitNoteService from "./debit-note.service";
import ResponseService from "./response.service";
import TicketService from "./ticket.service";

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

class DocumentService {
  private billService: BillService;
  private ticketService: TicketService;
  private creditNoteService: CreditNoteService;
  private debitNoteService: DebitNoteService;
  private responseService: ResponseService;

  constructor() {
    this.billService = new BillService();
    this.ticketService = new TicketService();
    this.creditNoteService = new CreditNoteService();
    this.debitNoteService = new DebitNoteService();
    this.responseService = new ResponseService();
  }

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

      const allData = [];

      const responseBills = await this.billService.findAll(format);
      if (responseBills.error) return responseBills;

      console.log(responseBills);

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

      console.log(allData);

      const total =
        responseBills.payload.length +
        responseTicket.payload.length +
        responseCreditNotes.payload.length +
        responseDebitNotes.payload.length;
      const pageCount = Math.ceil(total / data.pagination.limit);

      const formatData = {
        total,
        page: data.pagination.page,
        limit: data.pagination.limit,
        pageCount,
        data: allData,
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
}

export default DocumentService;
