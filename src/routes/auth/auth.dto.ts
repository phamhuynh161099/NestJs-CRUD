import { Exclude, Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import { Match } from 'src/shared/decorators/custom-validator.decorator';

export class LoginBodyDTO {
  @IsString()
  email: string;
  @IsString()
  password: string;
}

export class LoginResDTO {
  accessToken: string;
  refreshToken: string;

  constructor(partial: Partial<LoginResDTO>) {
    Object.assign(this, partial);
  }
}

export class RegisterBodyDTO extends LoginBodyDTO {
  @IsString()
  name: string;
  @IsString()
  @Match('password', { message: 'Mat khau khong khop' })
  confirmPassword: string;
}

/**
 * Demo Serialize
 * */
export class RegisterResDTO {
  id: number;
  email: string;
  name: string;
  @Exclude()
  password: string;
  createdAt: Date;
  updatedAt: Date;

  // @Expose() // Tao ra them truong moi cho DTO
  // get customeProperty() {
  //   return `${this.id} - ${this.email}`;
  // }

  constructor(partial: Partial<RegisterResDTO>) {
    Object.assign(this, partial);
  }
}

export class RefreshTokenBodyDTO {
  @IsString()
  refreshToken: string;
}

export class RefreshTokenResDTO extends LoginResDTO { }

export class LogoutBodyDTO {
  @IsString()
  refreshToken: string
}

export class LogoutResDTO {
  message: string
  constructor(partial: Partial<LogoutResDTO>) {
    Object.assign(this, partial);
  }
}
