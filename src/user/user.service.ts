import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterRequestDto } from '../auth/dtos/register-request.dto';

interface IUserService {
  getUsers(): Promise<User[]>;
  getUser(username: string): Promise<User | null>;
  createUser(data: RegisterRequestDto): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    return this.prisma.user.findMany();
  }

  async getUser(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async createUser(data: RegisterRequestDto) {
    const { username, password } = data;

    const user = await this.prisma.user.findUnique({ where: { username } });

    if (user) {
      throw new BadRequestException('Username already in use');
    }

    await this.prisma.user.create({
      data: {
        username,
        password: bcrypt.hashSync(password, 10),
        role: 'USER',
      },
    });
  }
}
