import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType, ConditionGuard } from 'src/shared/constants/auth.constant';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';

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
  createPost(@Body() body: any) {
    console.log('run create post', body);
    return this.postsService.createPost(body);
  }

  @Get(':id')
  getPost(@Param('id') id: any) {
    return this.postsService.getPost(id);
  }
}
