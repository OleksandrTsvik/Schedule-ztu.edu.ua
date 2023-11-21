import { IsOptional, IsString, IsUUID } from 'class-validator';

export class QueryToggleShowSubjectDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  subject?: string;
}
