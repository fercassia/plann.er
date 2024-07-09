import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";

const app = fastify(); //Criando aplicação

app.register(cors, {
  origin: "http://localhost:4800",
})// Configurando cors - para acesso das apis em construção serem acessadas no navegador

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip) //Registrando viagem do arquivo create-trip
app.register(confirmTrip) //Registrando confirmação de viagem do arquivo confirm-trip

//Aplicação escutando uma porta;
app.listen({ port: 4800 }).then(() => {
  console.log("Servidor rodando na porta 4800");
});
