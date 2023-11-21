import { IsBoolean, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ToggleShowScheduleSubjectDto {
  @IsNotEmpty()
  @IsUUID()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsBoolean()
  show: boolean;
}
