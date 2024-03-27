import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from 'src/decorators/public.decorator';
import ResponseDto from '../constants/response.dto';
import { RefreshAccessTokenRequestDto } from './dtos/refresh-access-token-request.dto';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return ResponseDto.successDefault(await this.authService.login(req.user));
  }

  @Post('/refresh-token')
  async refreshAccessToken(@Body() body: RefreshAccessTokenRequestDto) {
    return ResponseDto.successDefault(
      await this.authService.refreshAccessToken(body),
    );
  }
}
