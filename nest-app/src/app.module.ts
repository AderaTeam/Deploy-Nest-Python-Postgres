import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserModule } from './user/user.module';
import { TestService } from './test/test.service';
import { TestController } from './test/test.controller';
import { UserMiddleware } from './user/user.middleware';

@Module({
  imports: [UserModule,
            ConfigModule.forRoot(),
            JwtModule.register({
              global: true,
              secret: jwtConstants.secret,
              signOptions: { expiresIn: '60d' },
            }),
            ],
  controllers: [TestController],
  providers: [...databaseProviders, TestService],
})
export class AppModule {configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(UserMiddleware)
    .forRoutes(TestController);
}}
