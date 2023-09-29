import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { userProviders } from './user/user.repository';
import { databaseProviders } from './database.providers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot(),
            JwtModule.register({
              global: true,
              secret: jwtConstants.secret,
              signOptions: { expiresIn: '60d' },
            }),
            UserModule,],
  controllers: [UserController],
  providers: [UserService, ...userProviders, ...databaseProviders],
})
export class AppModule {}
