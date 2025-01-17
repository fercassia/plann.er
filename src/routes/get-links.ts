import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import zod from "zod";
import dayjs from "dayjs";
import { ClientError } from "../errors/client-error";

export async function getLinks(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/links",
    {
      schema: {
        params: zod.object({
          tripId: zod.string().uuid(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId },
        include: {
          links: true // Retorna todos os parametros dos links
        },
      });

      if (!trip) {
        throw new ClientError("Trip not found!");
      }

      return { links: trip.links };
    }
  );
}
