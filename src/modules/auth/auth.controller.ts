import { Controller, Post, UseGuards, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginUserDto } from './dto';
import { UserDocument } from '../database/models/user.model';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @Post('signup')
  async signup(@Body() userData: CreateUserDto): Promise<UserDocument> {
    return await this.authService.signup(userData);
  }


  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'Логин' })
  @Post('login')
  async login(@Body() userData: LoginUserDto, @Req() req) {
    return this.authService.login(userData, req.user);
  }
}
