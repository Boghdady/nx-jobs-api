import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { User } from '../users/models/user.model';
import { LoginInput } from './dto/login.input';
import { IGqlContext } from '@jobs-system/nestjs';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async login(
    @Args('loginInput') loginInput: LoginInput,
    @Context() context: IGqlContext
  ) {
    return this.authService.login(loginInput, context.res);
  }
}
