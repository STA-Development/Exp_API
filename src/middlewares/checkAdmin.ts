import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Inject,
  NotFoundException
} from '@nestjs/common';
import { UserRepository } from '../../src/users/repository/userRepository';
import * as admin from 'firebase-admin';

@Injectable()
export class RolesGuard implements CanActivate {
  @Inject()
  usersRepository: UserRepository;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const token = req.headers.authorization.split(' ')[1];
      const decodedIdToken = await admin.auth().verifyIdToken(token);
      const uid = decodedIdToken.uid;
      try {
        const user = await this.usersRepository.findOne(uid);
        if (user.isAdmin) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        throw new NotFoundException(`User with ID=${uid} not found`);
      }
    } catch (err) {
      return false;
    }
  }
}
