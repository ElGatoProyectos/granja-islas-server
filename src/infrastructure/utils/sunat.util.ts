const businessTypes = ["S.A.C.", "S.A.", "S.R.L.", "I.C.C."];

export function extractCompanyDetails(name: string) {
  let businessName = name;
  let businessType = "";

  for (let type of businessTypes) {
    if (name.endsWith(type)) {
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
