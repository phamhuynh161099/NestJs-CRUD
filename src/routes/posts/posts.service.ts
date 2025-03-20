import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) { }

  getPosts() {
    return this.prismaService.post.findMany();
  }

  createPost(body: any, userId: any) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
    });
  }

  getPost(id: any) {
    return `post ${id}`;
  }
}
