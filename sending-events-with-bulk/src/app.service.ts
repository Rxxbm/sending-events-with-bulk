import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
export class AppService {
  private readonly events: Ponto[] = [];

  async findByEmployeeId(employeeId: string): Promise<Ponto> {
    return this.events.find((event) => event.employeeId === employeeId);
  }

  async save(ponto: Ponto) {
    const pontoAlreadyExists = await this.findByEmployeeId(ponto.employeeId);
    if (pontoAlreadyExists) {
      throw new Error('Ponto já registrado para o funcionário');
    }
    this.events.push(ponto);
  }

  async close(employeeId: string) {
    const ponto = this.events.find((event) => event.employeeId === employeeId);
    if (ponto) {
      ponto.checkout = new Date();
    }
    return {
      message: `Ponto fechado para o funcionário ${employeeId}`,
      ponto: ponto,
    };
  }
  async findAll(): Promise<Ponto[]> {
    return this.events;
  }
  async clear() {
    this.events.length = 0;
  }
}

@Injectable()
@Processor('pontos')
export class pontoProcessor {
  constructor(private readonly appService: AppService) {}
  @Process('verificarPonto')
  async verificarPonto(job: Job) {
    const { employeeId } = job.data;

    console.log('Job data', job.data);
  }
}

export type Ponto = {
  checkin: Date;
  checkout: Date;
  employeeId: string;
};
