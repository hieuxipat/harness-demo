import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { DemoQueueProcess, QueueProcessor } from '../types/queue.enum';

@Processor(QueueProcessor.DEMO)
export class DemoProcessor {
  @Process(DemoQueueProcess.PROCESS_1)
  async DemoProcess(job: Job<unknown>) {
    console.log(job.data);
  }
}
