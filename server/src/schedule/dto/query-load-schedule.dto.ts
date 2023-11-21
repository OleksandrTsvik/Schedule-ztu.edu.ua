import { IsEnum, IsOptional } from 'class-validator';

export enum LoadType {
  FULLY = 'FULLY',
  DEFAULT = 'DEFAULT',
}

export class QueryLoadScheduleDto {
  @IsOptional()
  @IsEnum(LoadType)
  loadType?: LoadType;
}
