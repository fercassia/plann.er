import fastify from "fastify";
import cors from "@fastify/cors";
import { createTrip } from "./routes/create-trip";
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod";
import { confirmTrip } from "./routes/confirm-trip";
import { confirmParticipants } from "./routes/confirm-participant";
import { createActivities } from "./routes/create-activity";
import { getActivities } from "./routes/get-activities";
import { createLink } from "./routes/create-links";
import { getLinks } from "./routes/get-links";
import { getParticipants } from "./routes/get-participants";
import { createInvite } from "./routes/create-invate";
import { updateTrip } from "./routes/update-trip";
import { getTripDetails } from "./routes/get-trip-details";
import { getParticipant } from "./routes/get-participant";
import { env } from "./env";

const app = fastify(); //Criando aplicação

app.register(cors, {
  origin: "*",
})// Configurando cors - para acesso das apis em construção serem acessadas no navegador

// Add schema validator and serializer
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createTrip) //Registrando viagem
app.register(confirmTrip) //Registrando confirmação de viagem
app.register(confirmParticipants) //Registrando confirmação de viagem
app.register(createActivities) //Registrando atividades de viagem
app.register(getActivities) //Retornando atividades de viagem
app.register(createLink) //Registrando links da viagem
app.register(getLinks) // Retornando links da viagem
app.register(getParticipants) //Retornando participantes da viagem
app.register(createInvite) //Registrando participantes da viagem
app.register(updateTrip) //Registrando atualização da viagem
app.register(getTripDetails) //Retornando os detalhes da viagem
app.register(getParticipant) //Retornando um participante

//Aplicação escutando uma porta;
app.listen({ port: env.PORT }).then(() => {
  console.log("Servidor rodando na porta 4800");
});
