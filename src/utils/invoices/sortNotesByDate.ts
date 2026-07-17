import InvoiceType from "../../types/InvoiceType";

const sortInvoicesByDate = (invoices: InvoiceType[]): InvoiceType[] => {
  return invoices.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export default sortInvoicesByDate;