import { makeUserController } from "../controllers/user/make-user-controller";
import { UserController } from "../controllers/user/user.controller";

export function useUserController(): UserController {
  return makeUserController();
}
