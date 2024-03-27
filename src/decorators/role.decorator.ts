import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

export const ROLE_KEY = 'role';
export const IsRole = (role: Role) => SetMetadata(ROLE_KEY, role);
