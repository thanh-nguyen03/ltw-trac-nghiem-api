import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import ResponseDto from '../common/constants/response.dto';
import { UpdateUserDto } from './dtos/update-user.dto';

@Controller('admin/users')
export class AdminUserController {
  constructor(private userService: UserService) {}

  @Get()
  async getUsers() {
    return ResponseDto.successDefault(await this.userService.getUsers());
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
