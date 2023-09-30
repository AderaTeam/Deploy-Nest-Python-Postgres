import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { databaseProviders } from './database.providers';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { UserModule } from './user/user.module';
import { TestService } from './test/test.service';
import { TestController } from './test/test.controller';
import { AnalysisService } from './analysis/analysis.service';
import { AnalysisController } from './analysis/analysis.controller';
import { AnalysisModule } from './analysis/analysis.module';

@Module({
  imports: [UserModule,
            ConfigModule.forRoot(),
            JwtModule.register({
              global: true,
              secret: jwtConstants.secret,
              signOptions: { expiresIn: '60d' },
            }),
            AnalysisModule,
            ],
  controllers: [TestController],
  providers: [...databaseProviders, TestService],
})
export class AppModule {}
