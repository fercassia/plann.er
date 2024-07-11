import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  API_BASE_URL: z.string().url(),
  WEB_BASE_URL: z.string().url(),
  PORT: z.coerce.number().default(4881) //converte em numbero (coerce) - recebe string pelo json
});

export const env = envSchema.parse(process.env);