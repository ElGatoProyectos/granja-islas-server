import { Role } from "@prisma/client";
import ResponseService, { T_Response } from "./response.service";
import BaseController from "../controllers/config/base.controller";
import prisma from "../../infrastructure/database/prisma";
import * as bcrypt from "bcrypt";
import slugify from "slugify";

export default class SeedService extends BaseController {
  private responseService: ResponseService;
  constructor() {
    super();
    this.responseService = new ResponseService();
  }

  async createSeed(): Promise<T_Response> {
    try {
      const users = [
        {
          role: Role.SUPERADMIN,
          name: "Jose",
          last_name: "SUPERADMIN",
          phone: "909808903",
          email: "superadmin@gmail.com",
          dni: "12345678",
        },
        {
          role: Role.ADMIN,
          name: "Sebastian",
          last_name: "ADMIN",
          phone: "909808903",
          email: "admin@gmail.com",
          dni: "23232323",
        },
        {
          role: Role.USER,
          name: "Juan",
          last_name: "USER",
          phone: "909808903",
          email: "user@gmail.com",
          dni: "45454545",
        },
      ];

      const companies = [
        {
          business_name: "Empresa 1",
          business_type: "Tipo 1",
          business_status: "Example status",
          business_direction_fiscal: "Example direction",
          description: "Description example company",
          user: "hans23232",
          phone: "40343040",
          country_code: "+51",
          ruc: "20535014940",
          key: "adawdadadwad",
        },
        {
          business_name: "Empresa 2",
          business_type: "Tipo 2",
          business_status: "Example status 2",
          business_direction_fiscal: "Example direction 2",
          description: "Description example company",
          user: "wda900adw",
          phone: "40343040",
          country_code: "+51",
          ruc: "90878965434",
          key: "adawdadadwad",
        },
      ];

      const usersValidate = await prisma.user.findMany();
      const companiesValidate = await prisma.company.findMany();

      if (usersValidate.length > 0 || companiesValidate.length > 0)
        return this.responseService.BadRequestException(
          "No se puede ejecutar el seed"
        );

      // [message] creacion de los usuarios
      Promise.all(
        users.map(async (user) => {
          const password = bcrypt.hashSync(user.dni, 11);
          await prisma.user.create({
            data: { ...user, password },
          });
        })
      );

      // [message] creacion de las empresas
      const company1 = await prisma.company.create({ data: companies[0] });
      const company2 = await prisma.company.create({ data: companies[1] });

      // // [message] creacion de los proveedores

      // const usersActive = await prisma.user.findMany();

      // const suppliers = [];

      // for (let i = 1; i <= 20; i++) {
      //   const supplier = {
      //     company_id: i % 2 === 0 ? company1.id : company2.id,
      //     user_id_created: usersActive[i % 3].id,
      //     business_name: `Proveedor ${i}`,
      //     business_type: `Tipo ${i}`,
      //     business_status: "Estado no definido",
      //     business_direction: `Direccion no definida ${i}`,
      //     ruc: `1234567890${i}`,
      //     phone: `98987876${i % 10}`,
      //     country_code: "51",
      //   };
      //   suppliers.push(supplier);
      // }

      // await prisma.supplier.createMany({ data: suppliers });

      // // [message] creacion de las etiquetas
      // const labels = [];

      // for (let i = 1; i <= 10; i++) {
      //   const label = {
      //     company_id: i % 2 === 0 ? company1.id : company2.id,
      //     user_created_id: usersActive[i % 3].id,
      //     title: `Etiqueta ${i}`,
      //     slug: slugify(`Etiqueta ${i}`, { lower: true }),
      //   };
      //   labels.push(label);
      // }

      // await prisma.productLabel.createMany({ data: labels });

      // // [message] creacion de las bancos
      // const banks = [];

      // for (let i = 1; i <= 10; i++) {
      //   const bank = {
      //     company_id: i % 2 === 0 ? company1.id : company2.id,
      //     user_created_id: usersActive[i % 3].id,
      //     title: `Banco ${i}`,
      //     slug: slugify(`Banco ${i}`, { lower: true }),
      //   };
      //   banks.push(bank);
      // }

      // await prisma.bank.createMany({ data: banks });

      // // [message] creacion de los productos

      // const suppliersBD = await prisma.supplier.findMany();

      // const products = [];

      // for (let i = 1; i <= 10; i++) {
      //   const product = {
      //     title: `Producto ${i}`,
      //     description: `Descripción del Producto ${i}`,
      //     amount: Math.random() * 100, // cantidad aleatoria entre 0 y 100
      //     price: parseFloat((Math.random() * 500).toFixed(2)), // precio aleatorio entre 0 y 500
      //     slug: slugify(`Producto ${i}`, { lower: true }),
      //     code_measure: `CM${i}`,
      //     unit_measure: `UM${i}`,
      //     supplier_id:
      //       suppliersBD[Math.floor(Math.random() * suppliersBD.length)].id, // proveedor aleatorio
      //   };
      //   products.push(product);
      // }

      // await prisma.product.createMany({ data: products });

      // // [message] creacion de facturas
      // const bills = [];

      // for (let i = 1; i <= 10; i++) {
      //   const month = ((i % 12) + 1).toString().padStart(2, "0");
      //   const year = 2024;
      //   const total = parseFloat((Math.random() * 1000).toFixed(2));
      //   const ammount_paid = parseFloat((Math.random() * total).toFixed(2));
      //   const ammount_pending = parseFloat((total - ammount_paid).toFixed(2));

      //   const bill = {
      //     company_id: i % 2 === 0 ? company1.id : company2.id,
      //     user_id_created: usersActive[i % usersActive.length].id,
      //     num_serie: `NS-${i.toString().padStart(3, "0")}`,
      //     num_cpe: i,
      //     code: `CODE-${i.toString().padStart(3, "0")}`,
      //     period: `${month}/${year}`,
      //     igv: parseFloat((Math.random() * 0.18).toFixed(2)),
      //     total: total,
      //     bill_status: "pending",
      //     ammount_paid: ammount_paid,
      //     ammount_pending: ammount_pending,
      //     supplier_id:
      //       suppliersBD[Math.floor(Math.random() * suppliersBD.length)].id,
      //     date: new Date(2024, i % 12, (i % 28) + 1),
      //   };
      //   bills.push(bill);
      // }

      // await prisma.bill.createMany({ data: bills });

      return this.responseService.SuccessResponse("Seed executed!");
    } catch (error) {
      return this.responseService.InternalServerErrorException("");
    } finally {
      await prisma.$disconnect();
    }
  }
}
