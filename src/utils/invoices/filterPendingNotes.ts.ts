import InvoiceType from "../../types/InvoiceType";

const filterPendingInvoices = (invoices: InvoiceType[]): InvoiceType[] => {
  return invoices.filter((invoice) => invoice.status === "pendente");
};

export default filterPendingInvoices