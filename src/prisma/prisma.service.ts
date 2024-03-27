import { PrismaClient } from '@prisma/client';
import { Injectable, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  onModuleInit() {
    this.$connect()
      .then(() => console.log('Connected to the database'))
      .catch((error) => console.error(error));
  }
}
