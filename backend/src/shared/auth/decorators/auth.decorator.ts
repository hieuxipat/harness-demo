import { applyDecorators, UseGuards } from '@nestjs/common';
// import { Roles } from './role.decorator';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { UnauthorizedResponse } from 'src/docs/default/default-response.swagger';
import { HeaderAuthGuard } from '../guards/header-auth.guard';

// export const RoleAuth = (...roles: UserRole[]) => {
//   return applyDecorators(
//     Roles(...roles),
//     UseGuards(UserGuard, RolesAuthGuard),
//     ApiBearerAuth('token'),
//     ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedResponse }),
//   );
// };

export const AppAuth = () => {
  return applyDecorators(
    UseGuards(HeaderAuthGuard),
    ApiBearerAuth('token'),
    ApiUnauthorizedResponse({ description: 'Unauthorized', type: UnauthorizedResponse }),
  );
};
