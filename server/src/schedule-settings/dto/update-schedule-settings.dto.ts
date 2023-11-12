import {
  IsBoolean,
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateScheduleSettingsDto {
  @IsNotEmpty()
  @IsString()
  scheduleForGroup: string;

  @IsNotEmpty()
  @IsDateString()
  dateFirstWeekSchedule: Date;

  @IsOptional()
  @IsString()
  linkToSelectiveSubjects?: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(2)
  weekForSelectiveSubjects: number;

  @IsNotEmpty()
  @IsBoolean()
  isLoadCabinentContent: boolean;

  @IsOptional()
  @IsString()
  cabinetLogin?: string;

  @IsOptional()
  @IsString()
  cabinetPassword?: string;
}
