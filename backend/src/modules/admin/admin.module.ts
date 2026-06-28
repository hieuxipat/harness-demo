import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopGeneral } from '../shop/entities/shop-general.entity';
import { ShopInfo } from '../shop/entities/shop-info.entity';
import { ShopInstalled } from '../shop/entities/shop-installed.entity';
import { AdminDailyLog } from './entities/admin-daily-log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopGeneral, ShopInfo, ShopInstalled, AdminDailyLog])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
