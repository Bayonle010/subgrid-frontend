import { z } from "zod";

export const createApiKeySchema = z.object({
  name: z
    .string()
    .min(1, "Key name is required")
    .min(3, "Name must be at least 3 characters")
    .max(64, "Name must be under 64 characters"),
});
