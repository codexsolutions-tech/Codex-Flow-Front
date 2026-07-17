const formatDate = (date: Date) => {
  const dataObj = new Date(date);

  const day = String(dataObj.getDate()).padStart(2, "0");
  const month = String(dataObj.getMonth() + 1).padStart(2, "0");
  const year = dataObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const formatDateHour = (date: Date) => {
  const dataObj = new Date(date);

  const day = String(dataObj.getDate()).padStart(2, "0");
  const month = String(dataObj.getMonth() + 1).padStart(2, "0");
  const year = dataObj.getFullYear();

  const hour = String(dataObj.getHours()).padStart(2, "0");
  const minutes = String(dataObj.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hour}:${minutes}`;
};

export { formatDate, formatDateHour };
