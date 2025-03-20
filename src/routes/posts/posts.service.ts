import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../shared/services/prisma.service';
import { CreatePostBodyDTO, UpdatePostBodyDTO } from './posts.dto';
import { isNotFoundPrismaError } from 'src/shared/helpers';

@Injectable()
export class PostsService {
  constructor(private readonly prismaService: PrismaService) { }

  getPosts(userId: any) {
    return this.prismaService.post.findMany({
      where: {
        authorId: userId
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    });
  }

  createPost(body: CreatePostBodyDTO, userId: any) {
    return this.prismaService.post.create({
      data: {
        title: body.title,
        content: body.content,
        authorId: userId,
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    });
  }

  getPost(postId: any) {
    return this.prismaService.post.findUniqueOrThrow({
      where: {
        id: postId
      },
      include: {
        author: {
          omit: {
            password: true
          }
        }
      }
    });
  }


  async updatePost({ postId, body, userId }: { postId: number, body: UpdatePostBodyDTO, userId: string }) {
    try {
      const post = await this.prismaService.post.update({
        where: {
          id: Number(postId),
          authorId: Number(userId)
        },
        data: {
          title: body.title,
          content: body.content
        },
        include: {
          author: {
            omit: {
              password: true
            }
          }
        }
      });

      return post;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new Error('Post not found')
      }

      throw error
    }
  }

  async deletePost(postId: string, userId: string): Promise<boolean> {
    try {
      await this.prismaService.post.delete({
        where: {
          id: Number(postId),
          authorId: Number(userId)
        }
      })

      return true;
    } catch (error) {
      if (isNotFoundPrismaError(error)) {
        throw new Error('Post not found')
      }

      throw error
    }
  }
}
