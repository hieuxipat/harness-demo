import { Controller, Get, ParseIntPipe, Query, UseInterceptors } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { SearchUsersAdminResponse, UserInfoResponse } from './response/admin.response';
import { SearchUsersAdminDto } from './dto/admin.dto';

@Controller('admin')
@ApiTags('Admin')
@UseInterceptors(CacheInterceptor)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('users/search')
  @CacheTTL(10 * 1000)
  @ApiOkResponse({ type: SearchUsersAdminResponse })
  searchUsersList(@Query() query: SearchUsersAdminDto) {
    return this.adminService.searchUsersAdmin(query);
  }

  @Get('user/info')
  @ApiOkResponse({ type: UserInfoResponse })
  getUserInfo(@Query('id', ParseIntPipe) id: number) {
    return this.adminService.getUserInfo(id);
  }
}
