import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import ResponseDto from '../common/constants/response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { IsRole } from '../common/decorators/role.decorator';
import { Role } from '@prisma/client';
import { UserFilter } from './constants/user-filter.query';
import { CreateUserDefaultDto } from './dtos/create-user-default.dto';

@Controller('admin/users')
@IsRole(Role.ADMIN)
export class AdminUserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers(@Query() query: UserFilter) {
    return ResponseDto.successDefault(await this.userService.getUsers(query));
  }

  @Post()
  async createMultipleUsers(@Body() data: CreateUserDefaultDto[]) {
    return ResponseDto.successDefault(
      await this.userService.createMultipleUsers(data),
    );
  }

  @Put(':id')
  async updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return ResponseDto.successDefault(
      await this.userService.updateUser(id, data),
    );
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return ResponseDto.successDefault(await this.userService.deleteUser(id));
  }
}
