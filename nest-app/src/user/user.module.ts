import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({})
export class UserModule {
    imports:[]
    controllers: [UserController]
    providers: [UserService]
}
