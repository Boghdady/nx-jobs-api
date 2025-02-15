import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  /*
   * 1) When a GraphQL operation is received, this guard is invoked
   * 2) The getRequest method extracts the HTTP request from the GraphQL context
   * 3) The parent AuthGuard('jwt') class then uses this request to validate the JWT token
   */
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    console.log(ctx.getContext().req.cookies);
    return ctx.getContext().req;
  }
}
