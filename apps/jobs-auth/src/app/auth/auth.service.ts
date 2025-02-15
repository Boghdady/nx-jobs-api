import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

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
