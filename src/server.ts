import fastify from "fastify";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";

const app = fastify(); //Criando aplicação

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip) //Registrando viagem do arquivo create-trip

//Aplicação escutando uma porta;
app.listen({ port: 4800 }).then(() => {
  console.log("Servidor rodando na porta 4800");
});
