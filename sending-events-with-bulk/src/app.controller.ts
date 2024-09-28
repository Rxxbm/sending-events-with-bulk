import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Param,
} from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiOperation,
  ApiTags,
  ApiParam,
  ApiBody,
  ApiResponse,
} from '@nestjs/swagger';

export class PontoDTO {
  employeeId: string;
}

@Controller()
@ApiTags('Pontos Controller')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/pontos/:employeeId')
  @ApiOperation({ summary: 'Find ponto by employee ID' })
  @ApiParam({
    name: 'employeeId',
    required: true,
    description: 'ID of the employee',
  })
  @ApiResponse({ status: 200, description: 'Ponto found' })
  @ApiResponse({ status: 404, description: 'Ponto not found' })
  findOne(@Param('employeeId') employeeId: string) {
    return this.appService.findByEmployeeId(employeeId);
  }

  @Get('/pontos')
  @ApiOperation({ summary: 'Return all pontos' })
  @ApiResponse({ status: 200, description: 'All pontos returned' })
  findAll() {
    return this.appService.findAll();
  }

  @Post('/pontos')
  @ApiOperation({ summary: 'Add a new ponto' })
  @ApiBody({
    description: 'Ponto data',
    type: PontoDTO,
    examples: {
      exemplo1: {
        summary: 'Valid ponto example',
        description: 'Adding ponto for employee',
        value: {
          employeeId: 'any_employee_id',
        },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Ponto created' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async addPonto(@Body() body: PontoDTO) {
    const { employeeId } = body;
    const date = new Date();
    const after_date = null;
    try {
      const result = await this.appService.save({
        checkin: date,
        checkout: after_date,
        employeeId,
      });
      return result;
    } catch (error) {
      return { message: error.message };
    }
  }

  @Delete('/pontos')
  @ApiOperation({ summary: 'Clear all pontos' })
  @ApiResponse({ status: 200, description: 'All pontos cleared' })
  clear() {
    return this.appService.clear();
  }

  @Patch('/pontos/:employeeId')
  @ApiOperation({ summary: 'Close ponto by employee ID' })
  @ApiParam({
    name: 'employeeId',
    required: true,
    description: 'ID of the employee',
  })
  @ApiResponse({ status: 200, description: 'Ponto closed' })
  @ApiResponse({ status: 404, description: 'Ponto not found' })
  async close(@Param('employeeId') employeeId: string) {
    return await this.appService.close(employeeId);
  }
}
