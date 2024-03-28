import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { Public } from 'src/common/decorators/public.decorator';
import ResponseDto from '../common/constants/response.dto';
import { RefreshAccessTokenRequestDto } from './dtos/refresh-access-token-request.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { Message } from '../common/constants/message';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return ResponseDto.successDefault(await this.authService.login(req.user));
  }

  @Post('/register')
  async register(@Body() registerRequestDto: RegisterRequestDto) {
    await this.authService.register(registerRequestDto);
    return ResponseDto.successWithoutData(Message.USER_CREATED_SUCCESSFULLY);
  }

  @Post('/refresh-token')
  async refreshAccessToken(@Body() body: RefreshAccessTokenRequestDto) {
    return ResponseDto.successDefault(
      await this.authService.refreshAccessToken(body),
    );
  }
}
