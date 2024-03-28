import { Controller, Get } from '@nestjs/common';
import { Role } from '@prisma/client';
import { IsRole } from './common/decorators/role.decorator';

@Controller()
export class AppController {
  @Get('sample')
  getHello(): string {
    return 'Hello User!';
  }

  @IsRole(Role.ADMIN)
  @Get('admin-sample')
  getAdminHello(): string {
    return 'Hello Admin!';
  }
}
