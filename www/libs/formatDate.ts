export const formatDate = (data: string) => {
  if (data) {
    const monthYear = data.split(" CY");
    const formattedDate = `${monthYear[0]}-${monthYear[1]}`;
    return formattedDate;
  }
  return "";
};
