import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import configuration from './config/configuration';
import { configValidationSchema } from './config/config.schema';
import { ScheduleSettingsModule } from './schedule-settings/schedule-settings.module';
import { ScheduleModule } from './schedule/schedule.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        const config = configuration();

        return {
          type: 'sqlite',
          autoLoadEntities: true,
          synchronize: true,
          database: config.database.sqlite,
        };
      },
    }),
    ScheduleSettingsModule,
    ScheduleModule,
    UserModule,
    AuthModule,
    RefreshTokenModule,
  ],
})
export class AppModule {}
