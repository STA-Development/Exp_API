import { CanActivate, ExecutionContext } from '@nestjs/common';
import * as admin from 'firebase-admin';

export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest();
      const res = context.switchToHttp().getResponse();
      const token = req.headers.authorization.split(' ')[1];
      const decodedIdToken = await admin.auth().verifyIdToken(token);
      res.locals.userUid = decodedIdToken.uid;
      return true;
    } catch (error) {
      return false;
    }
  }
}
