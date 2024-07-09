import { PrismaClient } from "@prisma/client";

//Exibe log do servidor ao realizar um query no banco de dados
//Saber quais são as queries realizadas no banco de dados
export const prisma = new PrismaClient({
    log: ['query']
});