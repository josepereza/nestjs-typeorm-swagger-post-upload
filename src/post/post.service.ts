import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}

  async create(
    createPostDto: CreatePostDto,
    imageFile: Express.Multer.File,
    userId: number,
  ): Promise<Post> {
    let imageUrl = null;

    if (imageFile) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const extension = path.extname(imageFile.originalname);
      const filename = `${uniqueSuffix}${extension}`;
      const uploadPath = path.join(process.cwd(), 'uploads');

      if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
      }

      fs.writeFileSync(path.join(uploadPath, filename), imageFile.buffer);
      imageUrl = filename;
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      imageUrl,
      user: { id: userId },
    });

    return this.postsRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({
      relations: ['user'],
    });
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }
}
