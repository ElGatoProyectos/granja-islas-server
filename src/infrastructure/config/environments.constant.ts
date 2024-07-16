import "dotenv/config";

export const environments = {
  PORT: process.env.PORT ? process.env.PORT : "4000",

  BASE_API_SUNAT: process.env.BASE_API_SUNAT ? process.env.BASE_API_SUNAT : "",

  BASE_API_QUERY: process.env.BASE_API_QUERY ? process.env.BASE_API_QUERY : "",

  JWT_TOKEN: process.env.JWT_TOKEN ? process.env.JWT_TOKEN : "",
};
