import {
  ConflictException,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { isUniqueConstraintPrismaError } from 'src/shared/helpers';
import { HashingService } from '../../shared/services/hashing.service';
import { PrismaService } from '../../shared/services/prisma.service';
import { TokenService } from '../../shared/services/token.service';
import { LoginBodyDTO } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly hashingService: HashingService,
    private readonly prismaService: PrismaService,
    private readonly tokenService: TokenService,
  ) {}

  async register(body: any) {
    try {
      const hashedPassword = await this.hashingService.hash(body.password);
      const user = await this.prismaService.user.create({
        data: {
          email: body.email,
          name: body.name,
          password: hashedPassword,
        },
      });

      return user;
    } catch (error) {
      console.log('error', error);
      if (isUniqueConstraintPrismaError(error)) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async login(body: LoginBodyDTO) {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
      },
    });

    if (!user) {
      throw new UnprocessableEntityException([
        {
          field: 'password',
          error: 'Password is incorrect',
        },
      ]);
    }

    const isPasswordMatch = await this.hashingService.compare(
      body.password,
      user.password,
    );

    const tokens = await this.generateTokens({ userId: user.id });
    return tokens;
  }

  async generateTokens(payload: { userId: number }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.tokenService.signAccessToken(payload),
      this.tokenService.signRefreshToken(payload),
    ]);

    const decodedRefreshToken =
      await this.tokenService.verifyRefreshToken(refreshToken);
    await this.prismaService.refreshToken.create({
      data: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: new Date(decodedRefreshToken.exp * 1000),
      },
    });

    return { accessToken, refreshToken };
  }

  async refreshToken(refreshToken: string) {
    try {
      // Decode to get user id
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      // Check is it exist in DB
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });

      // Delete it
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      return await this.generateTokens({ userId });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      throw new UnauthorizedException();
    }
  }

  async logout(refreshToken: string) {
    try {
      // Decode to get user id
      const { userId } =
        await this.tokenService.verifyRefreshToken(refreshToken);

      // Check is it exist in DB
      await this.prismaService.refreshToken.findUniqueOrThrow({
        where: {
          token: refreshToken,
        },
      });

      // Delete it
      await this.prismaService.refreshToken.delete({
        where: {
          token: refreshToken,
        },
      });

      return {
        message : 'Logout successfully'
      }
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        throw new UnauthorizedException('Refresh token has been revoked');
      }

      throw new UnauthorizedException();
    }
  }
}
