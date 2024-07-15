//todo recibir anio mes y dia
export function convertToDateTime(date: string): Date {
  const newDate = new Date(date);
  newDate.setUTCHours(0, 0, 0, 0);
  return newDate;
}
