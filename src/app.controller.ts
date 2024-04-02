import { Controller, Get } from '@nestjs/common';
import { Role, User } from '@prisma/client';
import { IsRole } from './common/decorators/role.decorator';
import { CurrentUser } from './common/decorators/current-user.decorator';
import ResponseDto from './common/constants/response.dto';

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

  @Get('/current-user')
  async currentUser(@CurrentUser() user: User) {
    return ResponseDto.successDefault(user);
  }
}
