import { IsOptional, IsString } from 'class-validator';
import { DefaultPaginationRequest } from 'src/docs/default/default-request.swagger';

export class SearchUsersAdminDto extends DefaultPaginationRequest {
  @IsOptional()
  @IsString()
  search?: string;
}
