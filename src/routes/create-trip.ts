import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import zod from "zod";
import nodemailer from "nodemailer";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips",
    {
      schema: {
        body: zod.object({
          destination: zod.string().min(4),
          starts_at: zod.coerce.date(),
          ends_at: zod.coerce.date(),
          owner_name: zod.string(),
          owner_email: zod.string().email(),
          emails_to_invite: zod.array(zod.string().email()),
        }),
      },
    },
    async (request) => {
      const {
        destination,
        starts_at,
        ends_at,
        owner_name,
        owner_email,
        emails_to_invite,
      } = request.body;

      if (dayjs(starts_at).isBefore(new Date())) {
        throw new ClientError("Start date must be a future date");
      }
      if (dayjs(ends_at).isBefore(starts_at)) {
        throw new ClientError("Ends date must be after starts date");
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: {
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true,
                },
                //Concatenar na lista de objetos emails de convidados (...)
                ...emails_to_invite.map((email) => {
                  return { email };
                }),
              ],
            },
          },
        },
      });

      const formatedStartDate = dayjs(trip.starts_at).format("LL");
      const formatedEndsDate = dayjs(trip.ends_at).format("LL");

      const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`;

      //Enviar email para o dono da viagem
      const mail = await getMailClient();
      const message = await mail.sendMail({
        from: {
          name: "Equipe plann.er",
          address: "equipeplanner@plann.er",
        },
        to: {
          name: owner_name,
          address: owner_email,
        },
        subject: `Confirmação de viagem para ${trip.destination}`,
        html: `
        <div style="font-family: sans-serif; font-size: 16px;line-height: 1.6;">
            <p>Hi ${owner_name},</p>
            <p></p>
            <p>Você solicitou a criação de uma viagem para <strong>${trip.destination}</strong> nas datas <strong>${formatedStartDate}</strong> e <strong>${formatedEndsDate}</strong></p>
            <p></p>
            <p>Para confirmar clique no link disponibilizado ao lado - <a href="${confirmationLink}">Clique aqui</a></p>
            <p></p>
            <p>Caso você não saiba de que se trata esse e-mail, apenas ignore esse e-mail.</p>
        </div>
        `.trim(),
      });
      console.log(nodemailer.getTestMessageUrl(message));
      return { tripId: trip.id, message: "Trip created successfully!" };
    }
  );
}
