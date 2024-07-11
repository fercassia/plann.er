import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { dayjs } from "../lib/dayjs";
import zod from "zod";
import { ClientError } from "../errors/client-error";

export async function createActivities(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/activities",
    {
      schema: {
        params: zod.object({
          tripId: zod.string().uuid(),
        }),
        body: zod.object({
          title: zod.string().min(4),
          occurs_at: zod.coerce.date(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { title, occurs_at } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });

      if(!trip){
        throw new ClientError("Trip not found!");
      }

      if(dayjs(occurs_at).isBefore(dayjs(trip.starts_at))){
        throw new ClientError("Invalid activitie date!");
      }

      if(dayjs(occurs_at).isAfter(dayjs(trip.ends_at))){
        throw new ClientError("Invalid activitie date!");
      }

      const activity = await prisma.activity.create({
        data: {
          title,
          occurs_at,
          trip_id: tripId
        }
      })
      
      return { activityId: activity.id, message: "Activity created successfully!" };
    }
  );
}
