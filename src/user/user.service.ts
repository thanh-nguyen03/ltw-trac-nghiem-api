import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { RegisterRequestDto } from '../auth/dtos/register-request.dto';
import { Message } from '../common/constants/message';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserFilter } from './constants/user-filter.query';

interface IUserService {
  getUsers(filter: UserFilter): Promise<User[]>;
  getUser(username: string): Promise<User | null>;
  createUser(data: RegisterRequestDto): Promise<void>;
  updateUser(useId: number, data: UpdateUserDto): Promise<User>;
  deleteUser(userId: number): Promise<void>;
}

@Injectable()
export class UserService implements IUserService {
  constructor(private prisma: PrismaService) {}

  async getUsers(filter: UserFilter) {
    const { query } = filter;
    return this.prisma.user.findMany({
      where: {
        fullName: {
          contains: query,
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

  async updateUser(userId: number, data: UpdateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException(Message.USER_NOT_FOUND);
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
      throw new BadRequestException(Message.USER_NOT_FOUND);
    }

    await this.prisma.user.delete({ where: { id: userId } });
  }
}
