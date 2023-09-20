import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class UpdateSettingsDto {
  @IsNotEmpty()
  @IsString()
  scheduleForGroup: string;

  @IsNotEmpty()
  @IsDateString()
  dateFirstWeekSchedule: Date;

  @IsOptional()
  @IsString()
  linkToSelectiveSubjects: string;

  @IsOptional()
  @IsString()
  cabinetLogin: string;

  @IsOptional()
  @IsString()
  cabinetPassword: string;
}
