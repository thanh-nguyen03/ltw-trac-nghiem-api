import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterRequestDto } from '../auth/dtos/register-request.dto';
import { Message } from '../common/constants/message';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserFilter } from './constants/user-filter.query';
import { CreateUserDefaultDto } from './dtos/create-user-default.dto';

interface IUserService {
  getUsers(filter: UserFilter): Promise<User[]>;
  getUser(username: string): Promise<User | null>;
  createUser(data: RegisterRequestDto): Promise<void>;
  createMultipleUsers(data: CreateUserDefaultDto[]): Promise<User[]>;
  updateUser(useId: number, data: UpdateUserDto): Promise<User>;
  deleteUser(userId: number): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(filter: UserFilter) {
    const { fullName } = filter;
    return this.prisma.user.findMany({
      where: {
        fullName: {
          contains: fullName,
        },
      },
    });
  }

  async getUser(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  async createUser(data: RegisterRequestDto) {
    const { username, fullName, password } = data;

    const user = await this.prisma.user.findUnique({ where: { username } });

    if (user) {
      throw new BadRequestException('Username already in use');
    }

    await this.prisma.user.create({
      data: {
        username,
        fullName,
        password: bcrypt.hashSync(password, 10),
        role: 'USER',
      },
    });
  }

  async createMultipleUsers(data: CreateUserDefaultDto[]) {
    for (const user of data) {
      const { username } = user;

      const existingUser = await this.prisma.user.findUnique({
        where: { username },
      });

      if (existingUser) {
        throw new BadRequestException(`Username "${username}" already in use`);
      }
    }

    await this.prisma.user.createMany({
      data: data.map((user) => ({
        ...user,
        password: bcrypt.hashSync(user.username + '@1234', 10),
        role: 'USER',
      })),
    });

    return this.prisma.user.findMany({
      where: {
        OR: data.map((user) => ({
          username: user.username,
        })),
      },
    });
  }

  async updateUser(userId: number, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(Message.USER_NOT_FOUND);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: {
        ...data,
      },
    });
  }

  async deleteUser(userId: number): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException(Message.USER_NOT_FOUND);
    }

    await this.prisma.user.delete({ where: { id: userId } });
  }
}
