import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Message } from '../constants/message';
import { LoginRequestDto } from './dtos/login-request.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User, UserToken } from '@prisma/client';
import * as crypto from 'crypto';
import { LoginResponseDto } from './dtos/login-response.dto';
import { RefreshAccessTokenRequestDto } from './dtos/refresh-access-token-request.dto';
import { RefreshAccessTokenResponseDto } from './dtos/refresh-access-token-response.dto';

const { createHash, randomBytes } = crypto;

interface IAuthService {
  validateUser(username: string, password: string): Promise<User>;
  login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto>;
  refreshAccessToken(
    refreshAccessTokenRequestDto: RefreshAccessTokenRequestDto,
  ): Promise<RefreshAccessTokenResponseDto>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string) {
    const user = await this.userService.getUser(username);

    if (!(user && bcrypt.compareSync(password, user.password))) {
      throw new BadRequestException(Message.INVALID_CREDENTIALS);
    }

    return user;
  }

  async login(loginRequestDto: LoginRequestDto): Promise<LoginResponseDto> {
    const { username } = loginRequestDto;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...user } = await this.userService.getUser(username);

    const payload = {
      sub: user.username,
      user,
    };

    const access_token = this.jwtService.sign(payload);

    const userToken = await this.saveUserToken(user.id, access_token);

    return {
      access_token,
      refresh_token: userToken.refresh_token,
      user: {
        username: user.username,
        role: user.role,
      },
    };
  }

  async refreshAccessToken(
    refreshAccessTokenRequestDto: RefreshAccessTokenRequestDto,
  ): Promise<RefreshAccessTokenResponseDto> {
    const { refresh_token } = refreshAccessTokenRequestDto;

    const userToken = await this.prisma.userToken.findFirst({
      where: {
        refresh_token,
        // and not expired
        expiresAt: {
          gte: new Date(),
        },
      },
    });

    if (!userToken) {
      throw new BadRequestException(Message.INVALID_REFRESH_TOKEN);
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: userToken.userId,
      },
    });
    const payload = {
      sub: user.username,
      user,
    };
    const access_token = this.jwtService.sign(payload);
    await this.saveUserToken(user.id, access_token, userToken);

    return {
      access_token,
    };
  }

  private async saveUserToken(
    userId: number,
    accessToken: string,
    existingUserToken: UserToken = null,
  ) {
    if (existingUserToken) {
      existingUserToken.access_token = accessToken;
      return this.prisma.userToken.update({
        where: {
          id: existingUserToken.id,
        },
        data: {
          ...existingUserToken,
        },
      });
    }

    return this.prisma.userToken.create({
      data: {
        access_token: accessToken,
        refresh_token: this.generateRefreshToken(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  private generateRefreshToken(): string {
    return createHash('sha256')
      .update(randomBytes(32).toString('hex'))
      .digest('hex');
  }
}
