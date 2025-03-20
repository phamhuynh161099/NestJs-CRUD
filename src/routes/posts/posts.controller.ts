import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from 'src/shared/constants/auth.constant';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { Request } from 'express';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { TokenPayload } from 'src/shared/types/jwt.type';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  /**
   * Decorator quyết định type đăng nhập
   */
  @Auth([AuthType.Bearer, AuthType.APIKey], { condition: ConditionGuard.Or })
  /**
   * Nhận tham số từ decorator phía trên
   */
  // @UseGuards(AuthenticationGuard) // đã chuyển nó về global
  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @Post()
  @Auth([AuthType.Bearer])
  createPost(@Body() body: any, @ActiveUser('userId') userId: any) {
    console.log('post', userId)
    return this.postsService.createPost(body,userId);
  }

  @Get(':id')
  getPost(@Param('id') id: any) {
    return this.postsService.getPost(id);
  }
}
