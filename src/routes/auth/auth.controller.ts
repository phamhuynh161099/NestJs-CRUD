import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginBodyDTO,
  LoginResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from './auth.dto';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Nếu đã khai báo ở app.module không cần dùng nó ở đây nữa
   */
  // @UseInterceptors(ClassSerializerInterceptor)
  @SerializeOptions({ type: RegisterResDTO })
  @Post('register')
  async register(@Body() body: RegisterBodyDTO) {
    const result = await this.authService.register(body);

    // return result;
    /**
     * Nếu đã có @SerializeOptions({ type: RegisterResDTO }), thì không cần new DTO ...
     */
    return new RegisterResDTO(result);
  }

  @Post('login')
  async login(@Body() body: LoginBodyDTO) {
    console.log('Login', body);
    return new LoginResDTO(await this.authService.login(body));
  }

  @UseGuards(AccessTokenGuard)
  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    console.log('Login', body);
    return new RefreshTokenResDTO(
      await this.authService.refreshToken(body.refreshToken),
    );
  }
}
