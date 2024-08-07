export function convertToDate(dateString: string): Date {
  const [day, month, year] = dateString.split("/");
  return new Date(`${year}-${month}-${day}`);
}

export function convertStringToDate(date: string | null): Date | null {
  if (!date) {
    return null;
  }
  return new Date(date);
}
