import * as z from "zod"; 

// Para casos de validação de UI, normalmente atreladas a form
export const UserSchema = z.object({ 
  name: z.string(),
  email: z.email(),
  username: z.string().optional()
});