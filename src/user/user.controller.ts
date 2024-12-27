import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth('access-token') // Debe coincidir con el key en main.ts
export class UserController {
  constructor(private readonly usersService: UserService) {}

  @Post()
  create(@Body() createUserDto: any) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  @ApiOperation({ summary: 'Get current user profile with posts' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current user profile and their posts',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getCurrentUser(@Request() req) {
    return this.usersService.findOneWithPosts(req.user.userId);
  }

  //@ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  findAll() {
    return this.usersService.findAll();
  }
}
