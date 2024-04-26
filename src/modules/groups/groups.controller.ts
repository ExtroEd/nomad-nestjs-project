import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateGroupDto } from './dto';
import { GroupDocument } from '../database/models/group.model';
import { ObjectId } from '../../helpers/types/objectid.type';
import { IdValidationPipe } from '../../helpers/pipes/id-validation.pipe';
import { RolesGuard } from '../../helpers/guards/roles.guard';
import { Role } from '../../helpers/decorators/role.decorator';
import { Roles } from '../../helpers/enums/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Groups')
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)    
  @ApiOperation({ summary: 'Создать группу' })
  @Post('create')
  async createGroup(@Body() createGroupDto: CreateGroupDto) {
    return await this.groupsService.createGroup(createGroupDto);
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить весь список групп' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN,Roles.TEACHER)
  @Get('all')
  async getAllGroups(): Promise<GroupDocument[]> {
    const query = {
      is_deleted: false,
    };
    return await this.groupsService.find({ query });
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Получить группу по айди' })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN || Roles.TEACHER)
  @Get(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async getGroupById(@Param() group_id): Promise<GroupDocument> {
    return await this.groupsService.findGroupById(group_id.id);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN || Roles.TEACHER) 
  @ApiOperation({ summary: 'Удалить группу по айди' })
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async deleteGroupById(
    @Param('id') group_id,
  ): Promise<GroupDocument | string> {
    return await this.groupsService.deleteGroupById(group_id.id);
  }


  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN) 
  @ApiOperation({
    summary: 'Добавить студента в группу / изменить группу у студента',
  })
  @Put(':user_id/:group_id')
  @ApiParam({ name: 'user_id', type: 'string', required: true })
  @ApiParam({ name: 'group_id', type: 'string', required: true })
  async addStudentToGroup(
    @Param('user_id', IdValidationPipe) user_id: ObjectId,
    @Param('group_id', IdValidationPipe) group_id: ObjectId,
  ) {
    return await this.groupsService.addStudentToGroup(user_id, group_id);
  }
}
