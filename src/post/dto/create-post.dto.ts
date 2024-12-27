import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MinLength, MaxLength } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    description: 'The title of the post',
    example: 'My First Blog Post',
    minLength: 3,
    maxLength: 100,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(3, {
    message: 'Title is too short. Minimal length is 3 characters',
  })
  @MaxLength(100, {
    message: 'Title is too long. Maximal length is 100 characters',
  })
  title: string;

  @ApiProperty({
    description: 'The content of the post',
    example: 'This is the content of my first blog post...',
    minLength: 10,
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(10, {
    message: 'Content is too short. Minimal length is 10 characters',
  })
  content: string;
}
