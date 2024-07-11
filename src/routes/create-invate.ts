import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import nodemailer from "nodemailer";
import zod from "zod";
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    "/trips/:tripId/invites",
    {
      schema: {
        params: zod.object({
          tripId: zod.string().uuid(),
        }),
        body: zod.object({
          email: zod.string().email(),
        }),
      },
    },
    async (request) => {
      const { tripId } = request.params;
      const { email } = request.body;

      const trip = await prisma.trip.findUnique({
        where: { id: tripId }
      });

      if(!trip){
        throw new ClientError("Trip not found!");
      }

      const participant = await prisma.participant.create({
        data:{
          email,
          trip_id: tripId
        }
      });

      const formatedStartDate = dayjs(trip.starts_at).format("LL");
      const formatedEndsDate = dayjs(trip.ends_at).format("LL");

      //Enviar email para os convidados
      const mail = await getMailClient();

      const confirmationLink = `${env.API_BASE_URL}/${participant.id}/confirm`;

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
    return { participantId: participant.id, message: "Invite created successfully!" };
  })
}
