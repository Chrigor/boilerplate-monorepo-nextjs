import { GetUserByIdInput, UserRepository } from "business-core/application/repositories/user.repository";
import { GetUserByIdInputSchema } from "./user.schema";

export class UserController {
  constructor(private readonly userRepository: UserRepository) {}

  async getById(params: GetUserByIdInput) {
    GetUserByIdInputSchema.parse(params);
    return await this.userRepository.getById(params);
  }

  async getMe() {
    return await this.userRepository.getMe();
  }
}
