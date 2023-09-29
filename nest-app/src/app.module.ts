import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
            UserModule],
  controllers: [],
  providers: [...databaseProviders],
})
export class AppModule {}
