import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { AccessTokenGuard } from 'src/shared/guards/access-token.guard';
import { ApiKeyGuard } from 'src/shared/guards/api-key.guard';
import { Auth } from 'src/shared/decorators/auth.decorator';
import { AuthType, ConditionGuard, REQUEST_USER_KEY } from 'src/shared/constants/auth.constant';
import { AuthenticationGuard } from 'src/shared/guards/authentication.guard';
import { Request } from 'express';
import { ActiveUser } from 'src/shared/decorators/active-user.decorator';
import { TokenPayload } from 'src/shared/types/jwt.type';
import { CreatePostBodyDTO, GetPostItemDTO, UpdatePostBodyDTO } from './posts.dto';

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
  getPosts(@ActiveUser('userId') userId: any) {
    return this.postsService.getPosts(userId).then((posts) => posts.map((post: any) => new GetPostItemDTO(post)));
  }

  @Post()
  @Auth([AuthType.Bearer])
  async createPost(@Body() body: CreatePostBodyDTO, @ActiveUser('userId') userId: any) {
    console.log('post', userId)
    return new GetPostItemDTO(await this.postsService.createPost(body, userId) as any);
  }

  @Get(':id')
  async getPost(@Param('id') id: any) {
    return new GetPostItemDTO(await this.postsService.getPost(id) as any);
  }

  @Put(':id')
  @Auth([AuthType.Bearer])
  async updatePost(@Body() body: UpdatePostBodyDTO,@Param('id') id: any,@ActiveUser('userId') userId : string) {
    return new GetPostItemDTO(await this.postsService.updatePost({
      postId:Number(id),
      userId,
      body
    }) as any);
  }

  @Delete(':id')
  @Auth([AuthType.Bearer])
  async deletePost(@Param('id') id: string,@ActiveUser('userId') userId:string) {
    return new GetPostItemDTO(await this.postsService.deletePost(id,userId) as any);
  }
}
