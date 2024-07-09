import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import zod from "zod";

export async function createLink(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/links",
    {
      schema: {
        params: zod.object({
          tripId: zod.string().uuid(),
        }),
        body: zod.object({
          title: zod.string().min(4),
          url: zod.string().url(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { title, url } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });

      if(!trip){
        throw new Error("Trip not found!");
      }

      const link = await prisma.link.create({
        data: {
          title,
          url,
          trip_id: tripId
        }
      })
      
      return { linkId: link.id, message: "Url created successfully!" };
    }
  );
}
