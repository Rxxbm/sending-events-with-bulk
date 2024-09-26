import { Controller, Delete, Get, Patch, Post, Request } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/pontos/:employeeId')
  findOne(@Request() req) {
    const { employeeId } = req.params;
    return this.appService.findByEmployeeId(employeeId);
  }

  @Get('/pontos')
  findAll() {
    return this.appService.findAll();
  }

  @Post('/pontos')
  async addPonto(@Request() req) {
    const body: PontoDTO = req.body;
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
  clear() {
    return this.appService.clear();
  }

  @Patch('/pontos/:employeeId')
  close(@Request() req) {
    const { employeeId } = req.params;
    return this.appService.close(employeeId);
  }
}

export type PontoDTO = {
  employeeId: string;
};
