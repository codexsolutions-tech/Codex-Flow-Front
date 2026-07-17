import InvoiceType from "../../types/InvoiceType";

const calculateTotalInvoice = (invoices: InvoiceType[]): number => {
  return invoices.reduce((acc, invoice) => {
    if (invoice.status === "pendente") {
      const pendente = Number(invoice.total_venda) - Number(invoice.total_pago);
      return acc + Math.max(pendente, 0);
    }

    if (invoice.status === "baixada") return acc + Number(invoice.total_pago);
    

    return acc;
  }, 0);
};

export default calculateTotalInvoice;
