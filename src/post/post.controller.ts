import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { Request } from 'express';
import { PostService } from './post.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreatePostDto } from './dto/create-post.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

// Definimos una interfaz para extender Request
interface RequestWithUser extends Request {
  user: {
    userId: number;
    email: string;
  };
}

@ApiTags('posts')
@Controller('posts')
@ApiBearerAuth('access-token') // Debe coincidir con el key en main.ts
@Controller('posts')
export class PostController {
  constructor(private readonly postsService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiBearerAuth('access-token')
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        content: { type: 'string' },
        image: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async create(
    @Body() createPostDto: any,
    @UploadedFile() image: Express.Multer.File,
    @Req() req: RequestWithUser,
  ) {
    return this.postsService.create(createPostDto, image, req.user.userId);
  }
  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }
}
