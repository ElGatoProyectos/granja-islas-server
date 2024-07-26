export function convertToDate(dateString: string) {
  const [day, month, year] = dateString.split("/");
  return new Date(`${year}-${month}-${day}`);
}
