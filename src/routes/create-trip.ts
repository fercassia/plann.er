import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import { prisma } from "../lib/prisma";
import zod from "zod";
import dayjs from 'dayjs';
import nodemailer from 'nodemailer'
import { getMailClient } from "../lib/mail";

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
            body: zod.object({
                destination: zod.string().min(4),
                starts_at: zod.coerce.date(),
                ends_at: zod.coerce.date(),
                owner_name: zod.string(),
                owner_email: zod.string().email(),
            })
        },
    },async (request) => {
        const {destination, starts_at, ends_at, owner_name, owner_email} = request.body;
        
        if(dayjs(starts_at).isBefore(new Date())){
           throw new Error('Start date must be a future date')
        }
        if(dayjs(ends_at).isBefore(starts_at)){
            throw new Error('Ends date must be after starts date')
        }

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at
            }
        })

        const mail = await getMailClient();
        const message = await mail.sendMail({
            from: {
                name: 'Equipe plann.er',
                address: 'equipeplanner@plann.er'
            },
            to:{
                name: owner_name,
                address: owner_email
            },
            subject: 'Trip created',
            html:'<p>Congratulations! Your trip was created successfully!</p>'
        })
        console.log(nodemailer.getTestMessageUrl(message))
        return { tripId: trip.id, message: 'Trip created successfully!' }
    })
}