import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  AUTH_PACKAGE_NAME,
  AUTH_SERVICE_NAME,
  AuthServiceClient,
} from '@jobs-system/grpc';
import { catchError, map, Observable, of } from 'rxjs';
import { ClientGrpc } from '@nestjs/microservices';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard implements CanActivate, OnModuleInit {
  private readonly logger = new Logger(GqlAuthGuard.name);
  private authService: AuthServiceClient;

  constructor(@Inject(AUTH_PACKAGE_NAME) private readonly client: ClientGrpc) {}

  onModuleInit() {
    this.authService =
      this.client.getService<AuthServiceClient>(AUTH_SERVICE_NAME);
  }

  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 1) Get the token from the Graphql context
    const token = this.getRequest(context).cookies?.Authentication;
    if (!token) {
      return false;
    }

    // 2) The parent AuthGuard('jwt') class then uses this request to validate the JWT token
    // and returns the user to the current context
    return this.authService
      .authenticate({ token, email: 'a.boghdady@gmail.com' })
      .pipe(
        map((res) => {
          this.getRequest(context).user = res;
          return true;
        }),
        catchError((err) => {
          this.logger.error(err);
          return of(false);
        })
      );
  }

  private getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
