import { Controller, UseGuards } from '@nestjs/common';
import { Observable } from 'rxjs';
import {
  AuthenticateRequest,
  AuthServiceController,
  AuthServiceControllerMethods,
  User,
} from '@jobs-system/grpc';
import { UsersService } from '../users/users.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ITokenPayload } from './interfaces/token-payload.interface';

@Controller()
@AuthServiceControllerMethods()
export class AuthController implements AuthServiceController {
  constructor(private readonly userService: UsersService) {}

  // The server implementation for gRPC Method
  @UseGuards(JwtAuthGuard)
  authenticate(
    request: AuthenticateRequest & { user: ITokenPayload }
  ): Promise<User> | Observable<User> | User {
    return this.userService.getUser({
      id: request.user.id,
    });
  }
}
