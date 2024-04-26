import {
  Controller,
  Post,
  Body,
  Put,
  Param,
  Delete,
  Get,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateTeacherDto, UpdateUserDto } from './dto';
import { ObjectId } from '../../helpers/types/objectid.type';
import { UserDocument } from '../database/models/user.model';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../helpers/guards/roles.guard';
import { Role } from '../../helpers/decorators/role.decorator';
import { Roles } from '../../helpers/enums/roles.enum';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Изменить данные пользователя по id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Put(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async updateUser(
    @Body() updateUserDto: UpdateUserDto,
    @Param() userId: ObjectId,
  ) {
    return await this.usersService.updateUserById(updateUserDto, userId);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Удалить пользователя по id' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async deleteUserById(@Param() userId: ObjectId) {
    return await this.usersService.deleteUserById(userId);
  }

  @ApiOperation({ summary: 'Получить одного пользователя по айди' })
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async getUserById(@Param() userId): Promise<UserDocument> {
    return await this.usersService.findUserById(userId.id);
  }

  @ApiOperation({ summary: 'Получить всех студентов' })
  @Get('all')
  async getAllUsers() {
    return await this.usersService.findAllActiveUsers();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Добавить учителя' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @Post('teacher')
  async registerTeacher(@Body() createTeacherDto: CreateTeacherDto) {
    return await this.usersService.createTeacher(createTeacherDto);
  }
}
