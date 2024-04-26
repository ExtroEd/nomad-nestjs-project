import { Body, Controller, Delete, Param, Post ,UseGuards} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { SubjectService } from './subjects.service';
import { CreateSubjectDto } from './dto';
import { SubjectDocument } from '../database/models/subject.model';
import { RolesGuard } from '../../helpers/guards/roles.guard';
import { Role } from '../../helpers/decorators/role.decorator';
import { Roles } from '../../helpers/enums/roles.enum';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApiBearerAuth} from '@nestjs/swagger';

@ApiTags('Subjects')
@Controller('subjects')
export class SubjectsController {
  constructor(private readonly subjectService: SubjectService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN)
  @ApiOperation({ summary: 'Создать предмет' })
  @Post('create')
  async createSubject(@Body() createSubjectDto: CreateSubjectDto) {
    return await this.subjectService.createSubject(createSubjectDto);
  }
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Role(Roles.ADMIN) 
  @ApiOperation({ summary: 'Удалить предмет по айди' })
  @Delete(':id')
  @ApiParam({ name: 'id', type: 'string', required: true })
  async deleteSubjectById(
    @Param('id') subject_id,
  ): Promise<SubjectDocument | string> {
    return await this.subjectService.deleteSubjectById(subject_id);
  }
}
