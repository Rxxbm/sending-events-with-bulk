import { Injectable } from '@nestjs/common';

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
}

export type Ponto = {
  checkin: Date;
  checkout: Date;
  employeeId: string;
};
