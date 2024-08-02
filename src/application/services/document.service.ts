import BillService from "./bill.service";
import CreditNoteService from "./credit-note.service";
import DebitNoteService from "./debit-note.service";
import ResponseService from "./response.service";
import TicketService from "./ticket.service";

type T_FindAlNopagination = {
  body: {
    year: number | undefined;
    month: number | undefined;
  };
  header: {
    ruc: string;
    token: string;
  };
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

  findAllByAccumulated = async ({ body, header }: T_FindAlNopagination) => {
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
}

export default DocumentService;
