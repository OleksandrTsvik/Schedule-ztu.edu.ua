import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    SettingsModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'schedule-ztu.edu.ua.db',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
