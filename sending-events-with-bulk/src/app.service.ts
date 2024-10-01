import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Job, Queue } from 'bull';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST || 'email',
      port: Number(process.env.MAIL_PORT) || 1025,
    });
  }

  async sendMail({ to, subject, text, from }): Promise<void> {
    try {
      await this.transporter.sendMail({
        from, // Sender address
        to, // List of receivers
        subject, // Subject line
        text, // Plain text body
      });

      console.log(`E-mail enviado para ${to}`);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw new Error('Erro ao enviar e-mail');
    }
  }
}

@Injectable()
export class AppService {
  private readonly events: Ponto[] = [];
  constructor(@InjectQueue('pontos') private readonly pontosQueue: Queue) {}

  async findByEmployeeId(employeeId: string): Promise<Ponto> {
    return this.events.find((event) => event.employeeId === employeeId);
  }

  async save(ponto: Ponto) {
    const pontoAlreadyExists = await this.findByEmployeeId(ponto.employeeId);
    if (pontoAlreadyExists) {
      throw new Error('Ponto já registrado para o funcionário');
    }
    this.events.push(ponto);

    await this.pontosQueue.add(
      'verificarPonto',
      { employeeId: ponto.employeeId },
      { delay: 15 * 1000 },
    );
  }

  async close(employeeId: string) {
    const ponto = this.events.find((event) => event.employeeId === employeeId);

    if (ponto) {
      ponto.checkout = new Date();
    }

    const jobs = await this.pontosQueue.getJobs(['delayed']);

    jobs.forEach(async (job) => {
      const { employeeId } = job.data;
      if (employeeId === ponto.employeeId) {
        await job.remove();
      }
    });

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

@Processor('pontos')
export class pontoProcessor {
  constructor(
    private readonly appService: AppService,
    private readonly email: MailService,
  ) {}
  @Process('verificarPonto')
  async verificarPonto(job: Job) {
    const { employeeId } = job.data;
    const ponto = await this.appService.findByEmployeeId(employeeId);
    if (ponto) {
      await this.email.sendMail({
        to: 'rubinho@email.com',
        subject: 'Ponto aberto',
        text: `O ponto do funcionário ${employeeId} ainda está aberto`,
        from: 'funcionario@email.com',
      });
    }
  }
}

export type Ponto = {
  checkin: Date;
  checkout: Date;
  employeeId: string;
};
