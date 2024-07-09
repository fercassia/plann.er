import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import zod from "zod";


export async function confirmParticipants (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/participants/:participantId/confirm",
    {
      schema: {
        params: zod.object({
          participantId: zod.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { participantId } = request.params;

     const participant = await prisma.participant.findUnique({
        where: {
          id: participantId,
        }
     })

     if (!participant) {
      throw new Error("Participant not found");
     }

     if (participant.is_confirmed) {
      return reply.redirect(`http://localhost:4800/trips/${participant.trip_id}`);
     }

     await prisma.participant.update({
      where:{ id: participantId},
      data: { is_confirmed: true }
     })
      return reply.redirect(`http://localhost:4800/trips/${participant.trip_id}`);
    })
  }