import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { HeaderStrategy } from './strategies/header.strategy';

@Module({
  imports: [PassportModule],
  providers: [AuthService, HeaderStrategy],
  exports: [AuthService],
})
export class AuthModule {}
