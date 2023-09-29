import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { databaseProviders } from 'src/database.providers';

@Module({imports:[],
        controllers: [UserController],
        providers: [UserService, ...databaseProviders],
        exports: [UserService]
    })
export class UserModule {}
