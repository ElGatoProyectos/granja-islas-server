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
