import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

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
