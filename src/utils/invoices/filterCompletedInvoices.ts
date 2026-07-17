import InvoiceType from "../../types/InvoiceType";

const filterCompletedInvoices = (invoices: InvoiceType[]): InvoiceType[] => {
  return invoices.filter((invoice) => invoice.status === "baixada");
};

export default filterCompletedInvoices;
