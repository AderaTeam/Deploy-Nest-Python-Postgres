import { createParamDecorator } from '@nestjs/common';

export const UserJwt = createParamDecorator((data, req) => {
  return req.headers.authorization;
});