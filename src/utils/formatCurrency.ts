const formatCurrency = (currency: number) =>
  Number(currency).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export { formatCurrency };
