import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import zod from "zod";
import dayjs from "dayjs";
import { ClientError } from "../errors/client-error";

export async function getActivities(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/activities",
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
          activities: {
            orderBy: {
              occurs_at: "asc",
            }
          }
        },
      });

      if (!trip) {
        throw new ClientError("Trip not found!");
      }

      const differenceBetweenTripDatesStartAndEnd = dayjs(trip.ends_at).diff(
        trip.starts_at,
        "day"
      );

      // Considerando o primeiro e ultimo dia como dias validos
      const activities = Array.from({
        length: differenceBetweenTripDatesStartAndEnd + 1,
      }).map((_, index) => {
        // Exibindo os dias da viagem
        const date = dayjs(trip.starts_at).add(index, "day");

        //Retornando as atividades da viagem de acordo com os dias da viagem 
        //e dias das atividades - Retorna os dias nulos também
        return {
          date: date.toDate(),
          activities: trip.activities.filter((activity) => {
            return dayjs(activity.occurs_at).isSame(date, "day");
          }),
        };
      });

      return { activities };
    }
  );
}
