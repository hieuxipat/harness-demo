import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopInfo } from './entities/shop-info.entity';
import { ShopGeneral } from './entities/shop-general.entity';
import { ShopInstalled } from './entities/shop-installed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopGeneral, ShopInfo, ShopInstalled])],
  controllers: [ShopController],
  providers: [ShopService],
  exports: [ShopService],
})
export class ShopModule {}
