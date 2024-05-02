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
  ) {}

  async signup(userData) {
    try {
      return await this.usersService.createUser(userData);
    } catch (error) {
      return error.message;
    }
  }

  async validateUser(email: string, password: string): Promise<UserDocument | string> {
    try {
      const user = await this.usersService.findOne({ email, password });
      if (!user) {
        throw new UnauthorizedException('Неверный адрес электронной почты или пароль');
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async login(userData: LoginUserDto, user: UserDocument) {
    const { email, password } = userData;
    const foundUser = await this.usersService.findOne({ email });

    if (!foundUser) {
      throw new UnauthorizedException('Неверный адрес электронной почты или пароль');
    }

    if (foundUser.is_blocked) {
      const timeToUnlock = (foundUser.banned_until.getTime() - new Date().getTime()) / 1000;
      throw new UnauthorizedException(`Аккаунт заблокирован. Пожалуйста, попробуйте снова через ${timeToUnlock} секунд.`);
    }

    if (new Date() > foundUser.banned_until) {
      if (foundUser.login_attempts >= 3) {
        foundUser.banned_until = new Date(Date.now() + 30 * 1000);
        foundUser.login_attempts = 0;
        await foundUser.save();
        throw new UnauthorizedException('Аккаунт заблокирован. Пожалуйста, попробуйте снова через 30 секунд.');
      } else {
        if (password !== foundUser.password) {
          foundUser.login_attempts += 1;
          await foundUser.save();
          throw new UnauthorizedException('Неверный адрес электронной почты или пароль');
        } else {
          try {
            const payload = { email, user_id: user._id, role: user.role };
            foundUser.login_attempts = 0;
            await foundUser.save();
            return {
              access_token: this.jwtService.sign(payload),
            };
          } catch (error) {
            throw new Error(error.message);
          }
        }
      }
    } else {
      throw new UnauthorizedException('Аккаунт временно заблокирован. Пожалуйста, попробуйте снова позже.');
    }
  }
}
