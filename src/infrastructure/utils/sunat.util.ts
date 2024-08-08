const businessTypes = [
  "S.A.C.",
  "S.A.",
  "S.R.L.",
  "I.C.C.",
  "E.I.R.L",
  "E.I.R.L.",
  "EIRL",
  "SAC",
  "SA",
  "SRL",
  "ICC",
  "EIRL",
];

export function extractCompanyDetails(name: string) {
  let businessName = name;
  let businessType = "";

  for (let type of businessTypes) {
    if (name.startsWith(type)) {
      businessType = type;
      businessName = name.slice(type.length).trim();
      break;
    } else if (name.endsWith(type)) {
      businessType = type;
      businessName = name.slice(0, name.length - type.length).trim();
      break;
    }
  }

  return {
    businessName,
    businessType,
  };
}

// recieb  "start": "2024-04", "end": "2024-07" i need  ["2024-04", "2024-05", "2024-06", "2024-07"]
export function getPeriodRange(start: string, end: string) {
  const [startYear, startMonth] = start.split("-");
  const [endYear, endMonth] = end.split("-");

  const startYearInt = Number(startYear);
  const endYearInt = Number(endYear);

  const startMonthInt = Number(startMonth);
  const endMonthInt = Number(endMonth);

  const periodRange = [];

  for (let year = startYearInt; year <= endYearInt; year++) {
    const start = year === startYearInt ? startMonthInt : 1;
    const end = year === endYearInt ? endMonthInt : 12;

    for (let month = start; month <= end; month++) {
      periodRange.push(`${year}-${month.toString().padStart(2, "0")}`);
    }
  }

  return periodRange;
}
