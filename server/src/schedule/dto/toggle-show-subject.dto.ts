import { IsBoolean, IsNotEmpty } from 'class-validator';

export class ToggleShowSubjectDto {
  @IsNotEmpty()
  @IsBoolean()
  show: boolean;
}
