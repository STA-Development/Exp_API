import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator((data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getResponse();
    return request.locals.userUid;
});