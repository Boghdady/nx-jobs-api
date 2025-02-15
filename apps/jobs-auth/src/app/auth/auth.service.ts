import { Response } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { LoginInput } from './dto/login.input';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async login({ email, password }: LoginInput, response: Response) {
    // 1) Verify user and password
    const user = await this.verifyUser(email, password);

    // 2) Generate expire time for cookie that will be the same as the generated jwt
    const expires = new Date();
    expires.setMilliseconds(
      expires.getTime() +
        parseInt(this.configService.getOrThrow('JWT_EXPIRATION_MS'), 10)
    );

    // 3) Generate the jwt payload
    const TokenPayload: TokenPayload = {
      id: user.id,
    };

    // 4) Generate the access token
    const accessToken = this.jwtService.sign(TokenPayload);

    // 5) Set the access token in the cookie
    response.cookie('Authentication', accessToken, {
      httpOnly: true,
      expires,
      secure: this.configService.getOrThrow('NODE_ENV') === 'production',
    });

    // 6) Return the user
    return user;
  }

  private async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersService.getUser({ email });
      if (!user) {
        throw new UnauthorizedException('Creadentials are not valid.');
      }

      const isPasswordValid = await compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Creadentials are not valid.');
      }

      return user;
    } catch (err) {
      throw new UnauthorizedException('Creadentials are not valid.');
    }
  }
}
