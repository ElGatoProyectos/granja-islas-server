import express from "express";

const routerUser = express.Router();

const prefix = "/users";

routerUser.get(prefix);
