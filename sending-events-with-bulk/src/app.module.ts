import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService, MailService, pontoProcessor } from './app.service';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'redis',
        port: parseInt(process.env.REDIS_PORT) || 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'pontos',
    }),
  ],
  controllers: [AppController],
  providers: [AppService, pontoProcessor, MailService],
})
export class AppModule {}
