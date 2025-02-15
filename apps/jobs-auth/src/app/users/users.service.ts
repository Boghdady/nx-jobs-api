import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './models/user.model';
import { Prisma } from '@prisma/clients/jobs-auth';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(input: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: input.email,
      },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    return this.prismaService.user.create({
      data: {
        ...input,
        password: await hash(input.password, 10),
      },
    });
  }

  async findAllUsers(): Promise<User[]> {
    return this.prismaService.user.findMany();
  }

  async getUser(args: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUnique({
      where: args,
    });
  }
}
