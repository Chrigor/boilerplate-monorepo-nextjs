import * as z from 'zod'

export const LoginSchema = z.object({
  email: z.email({ error: 'E-mail inválido' }),
  password: z.string().min(6, { error: 'A senha deve ter no mínimo 6 caracteres' }),
})

export type LoginFormData = z.infer<typeof LoginSchema>
