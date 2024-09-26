import { Controller, Delete, Get, Post, Request } from '@nestjs/common';
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
  addPonto(@Request() req) {
    const body: PontoDTO = req.body;
    const { employeeId } = body;
    console.log('employeeId', employeeId);
    const date = new Date();
    const after_date = new Date(date.getTime() + 1000 * 60 * 60 * 8);
    return this.appService.save({
      checkin: date,
      checkout: after_date,
      employeeId,
    });
  }

  @Delete('/pontos')
  clear() {
    return this.appService.clear();
  }
}

export type PontoDTO = {
  employeeId: string;
};
