import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import zod from "zod";
import { ClientError } from "../errors/client-error";

export async function updateTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().put(
    "/trips/:tripId",
    {
      schema: {
        params: zod.object({
          tripId: zod.string().uuid(),
        }),
        body: zod.object({
          destination: zod.string().min(4),
          starts_at: zod.coerce.date(),
          ends_at: zod.coerce.date(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const {
        destination,
        starts_at,
        ends_at,
      } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: request.params.tripId },
      });

      if (!trip) {
        throw new ClientError("Trip not found!");
      }

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new ClientError("Start date must be a future date");
      }
      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new ClientError("Ends date must be after starts date");
      }

      await prisma.trip.update({
        where: {id: tripId},
        data: {
          destination,
          starts_at,
          ends_at
        }
      })

      return { tripId: trip.id, destination, starts_at, ends_at, message: "Trip update successfully!" };
    }
  );
}
