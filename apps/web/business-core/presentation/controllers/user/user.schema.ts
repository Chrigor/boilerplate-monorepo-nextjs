import * as z from "zod";

// Este arquivo seria para validação de input / output do repository
export const UserSchema = z.object({
  id: z.string().min(8),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  accountId: z.string().min(8),
  avatar: z.string().optional(),
  permissions: z.string().optional(),
  isInternal: z.boolean().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

export const GetUserByIdInputSchema = z.object({
  id: z.string().min(8),
});
