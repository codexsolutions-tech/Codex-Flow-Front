const formatDate2 = (date: Date) => {
  return date.toISOString().split("T")[0]; // Sempre retorna "YYYY-MM-DD"
};

export default formatDate2;
