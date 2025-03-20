import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  SerializeOptions
} from '@nestjs/common';
import {
  LoginBodyDTO,
  LoginResDTO,
  LogoutBodyDTO,
  LogoutResDTO,
  RefreshTokenBodyDTO,
  RefreshTokenResDTO,
  RegisterBodyDTO,
  RegisterResDTO,
} from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

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

  @Post('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Body() body: RefreshTokenBodyDTO) {
    console.log('Login', body);
    return new RefreshTokenResDTO(
      await this.authService.refreshToken(body.refreshToken),
    );
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body() body:LogoutBodyDTO) {
    return new LogoutResDTO(await this.authService.logout(body.refreshToken))
  }
}
