import slugify from "slugify";
import prisma from "./src/infrastructure/database/prisma";

async function excecutedSeed() {
  const suppliersBD = await prisma.supplier.findMany();

  const products = [];

  for (let i = 1; i <= 10; i++) {
    const product = {
      title: `Producto ${i}`,
      description: `Descripción del Producto ${i}`,
      amount: parseFloat((Math.random() * 100).toFixed(2)), // cantidad aleatoria entre 0 y 100
      price: parseFloat((Math.random() * 500).toFixed(2)), // precio aleatorio entre 0 y 500
      slug: slugify(`Producto ${i}`, { lower: true }),
      code_measure: `CM${i}`,
      unit_measure: `UM${i}`,
      supplier_id:
        suppliersBD[Math.floor(Math.random() * suppliersBD.length)].id, // proveedor aleatorio
    };
    products.push(product);
  }

  await prisma.product.createMany({ data: products });
}

excecutedSeed();
