import { makeHttpClient } from "business-core/infra/make-http-client";
import { HttpUserRepository } from "business-core/infra/repositories/http-user.repository";
import { UserController } from "./user.controller";

export function makeUserController(): UserController {
  const http = makeHttpClient();
  const httpUserRepository = new HttpUserRepository(http);
  return new UserController(httpUserRepository);
}
