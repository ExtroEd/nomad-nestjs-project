import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../database/models/user.model';
import { CreateUserDto, LoginUserDto } from './dto';

@Injectable()
export class AuthService {
  private trys = 0;
  private time = null;

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(userData) {
    try {
      return await this.usersService.createUser(userData);
    } catch (error) {
      return error.message;
    }
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserDocument | string> {
    try {
      const user = await this.usersService.findOne({ email, password });
      if (!user) {
        return null;
      }
      return user;
    } catch (error) {
      return error.data;
    }
  }

  login(userData: LoginUserDto, user: UserDocument) {
    const { email } = userData;
  
    if (this.trys >= 3 && this.time && (Date.now() - this.time) < 60000) {
      const remainingTimeInSeconds = Math.ceil((60000 - (Date.now() - this.time)) / 1000);
      console.log(`оставшееся время ${remainingTimeInSeconds}`);
      throw new Error();
    }
    
    try {
      const payload = { email, user_id: user._id, role: user.role };
      return {
        access_token: this.jwtService.sign(payload),
      };
    } catch (error) {
      this.trys++;
      this.time = Date.now();
      const tr = 3 - this.trys;
      console.log(`попытки ${tr}`);
      throw error;
    }
  }
  
}
