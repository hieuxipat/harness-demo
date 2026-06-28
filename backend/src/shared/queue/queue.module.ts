import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { QueueController } from './queue.controller';
import { BullModule } from '@nestjs/bull';
import { DemoProcessor } from './processors/demo.processor';
import { QueueProcessor } from './types/queue.enum';

@Module({
  imports: [BullModule.registerQueue({ name: QueueProcessor.DEMO })],
  controllers: [QueueController],
  providers: [QueueService, DemoProcessor],
  exports: [BullModule],
})
export class QueueModule {}
