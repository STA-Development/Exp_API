import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject
} from '@nestjs/common';
import { UserRepository } from '../users/repository/userRepository';

@Injectable()
export class RolesGuard implements CanActivate {
  @Inject()
  usersRepository: UserRepository;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const res = context.switchToHttp().getResponse();
    const uid = res.locals.userUid;
    try {
      const user = await this.usersRepository.findOne(uid);
      return user.isAdmin;
    } catch (err) {
      return false;
    }
  }
}
