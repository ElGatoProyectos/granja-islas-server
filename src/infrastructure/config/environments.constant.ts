import "dotenv/config";

export const environments = {
  PORT: process.env.PORT || "4000",

  BASE_API_SUNAT: process.env.BASE_API_SUNAT || "",

  BASE_API_QUERY: process.env.BASE_API_QUERY || "",

  JWT_TOKEN: process.env.JWT_TOKEN || "",

  BASE_API_GET_TOKEN: process.env.BASE_API_GET_TOKEN || "",
  BASE_API_SIRE: process.env.BASE_API_SIRE || "",

  CLIENT_ID: process.env.CLIENT_ID || "",
  CLIENT_SECRET: process.env.CLIENT_SECRET || "",
  USERNAME_SUNAT: process.env.USERNAME_SUNAT || "",
  PASSWORD_SUNAT: process.env.PASSWORD_SUNAT || "",
};
