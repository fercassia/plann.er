import type { FastifyInstance } from "fastify";
import { ClientError } from "./errors/client-error";
import { ZodError } from "zod";

type FastifyErrorHandler = FastifyInstance["errorHandler"];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if(error instanceof ZodError) {
    reply.status(400).send({
      message: "Invalid input",
      errors: error.flatten().fieldErrors
    })
  }
  if(error instanceof ClientError) {
    reply.status(400).send({
      message: error.message
    });
  }
  reply.status(500).send({
    message: "Internal Server Error"
  });
};