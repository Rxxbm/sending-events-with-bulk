import { Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';

@Injectable()
export class AppService {
  private readonly events: Ponto[] = [];
  async save(ponto: Ponto) {
    this.events.push(ponto);
  }
  async findAll(): Promise<Ponto[]> {
    return this.events;
  }
  async clear() {
    this.events.length = 0;
  }
  async findByEmployeeId(employeeId: string): Promise<Ponto> {
    return this.events.find((event) => event.employeeId === employeeId);
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
