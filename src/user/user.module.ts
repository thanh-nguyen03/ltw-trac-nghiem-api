import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { UserService } from './user.service';
import { AdminUserController } from './admin-user.controller';

@Module({
  imports: [PrismaModule],
  controllers: [AdminUserController],
  providers: [UserService],
})
export class UserModule {}
