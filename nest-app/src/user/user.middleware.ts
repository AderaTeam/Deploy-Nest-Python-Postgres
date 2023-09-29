import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class UserMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: () => void) {
    req["user"] = req.headers['authorization'].split(' ')[1]
    next();
  }
}
