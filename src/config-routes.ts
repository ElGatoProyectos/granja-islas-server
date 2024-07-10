import express from "express";
import authRouter from "./apis/auth.api";

export function InitRoutes(app: express.Application) {
  const globalPrefix = "/api";
  app.use(globalPrefix, authRouter);
}
