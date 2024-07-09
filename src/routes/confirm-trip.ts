import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import zod from "zod";
import nodemailer from "nodemailer";

export async function confirmTrip (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get(
    "/trips/:tripId/confirm",
    {
      schema: {
        params: zod.object({
          tripId: zod.string().uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { tripId } = request.params;

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId,
        },
        include:{
          participants:{
            where:{ is_owner: false}
          }
        }
      });
      
      if (!trip) {
        throw new Error("Trip not found");
      }

      if (trip.is_confirmed) {
        return reply.redirect(`http://localhost:4800/trips/${tripId}`);
      }

      await prisma.trip.update({
        where: { id: tripId },
        data: { is_confirmed: true }
      });

      const formatedStartDate = dayjs(trip.starts_at).format("LL");
      const formatedEndsDate = dayjs(trip.ends_at).format("LL");

      //Enviar email para os convidados
      const mail = await getMailClient();

      await Promise.all([
        trip.participants.map(async (participant) =>{
        const confirmationLink = `http://localhost:4800/participants/${participant.id}/confirm`;

          const message = await mail.sendMail({
            from: {
              name: "Equipe plann.er",
              address: "equipeplanner@plann.er",
            },
            to: participant.email,
            subject: `Confirmação de presença na viagem para ${trip.destination} em ${formatedStartDate}`,
            html: `
            <div style="font-family: sans-serif; font-size: 16px;line-height: 1.6;">
                <p>Oi Amigo,</p>
                <p></p>
                <p>Você foi convidado para participar de uma viagem para <strong>${trip.destination}</strong> nas datas <strong>${formatedStartDate}</strong> e <strong>${formatedEndsDate}</strong></p>
                <p></p>
                <p>Para confirmar sua presença na viagem, clique no link disponibilizado ao lado - <a href="${confirmationLink}">Clique aqui</a></p>
                <p></p>
                <p>Caso você não saiba de que se trata esse e-mail, apenas ignore esse e-mail.</p>
            </div>
            `.trim(),
          })

          console.log(nodemailer.getTestMessageUrl(message));
        })
      ])
      return reply.redirect(`http://localhost:4800/trips/${tripId}`);
    })
  }