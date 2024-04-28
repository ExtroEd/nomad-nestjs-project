import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../database/models/user.model';
import { CreateUserDto, LoginUserDto } from './dto';


@Injectable()
export class AuthService {

  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) { }

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

  async login(userData: LoginUserDto, user: UserDocument) {
    const { email } = userData;
    const userr = await this.usersService.findOne({ email });
    if (new Date() > userr.date) {
      try {
        const payload = { email, user_id: user._id, role: user.role };
        userr.trys = 0
        await userr.save()
        return {
          access_token: this.jwtService.sign(payload),
        };
      } catch (error) {
        if (userr.trys >= 3) {
          userr.date = new Date(Date.now() + 1 * 60 * 1000);
          userr.trys = 0
          await userr.save()
        } else {
          userr.trys += 1
          await userr.save()
        }
      }
    } else {
      console.log('время еще не прошло');

    }
  }

}
