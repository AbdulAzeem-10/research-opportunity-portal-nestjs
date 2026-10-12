import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OpportunityStatus } from '../enums/opportunity-status.enum';

export class UpdateOpportunityDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @IsOptional()
  @IsString({ message: 'Research area must be a string' })
  researchArea?: string;

  @IsOptional()
  @IsString({ message: 'Faculty member name must be a string' })
  facultyMemberName?: string;

  @IsOptional()
  @IsString({ message: 'Department must be a string' })
  department?: string;

  @IsOptional()
  @IsArray({ message: 'Required skills must be an array of strings' })
  @IsString({ each: true, message: 'Each required skill must be a string' })
  requiredSkills?: string[];

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Number of positions must be an integer' })
  @Min(1, {
    message: 'Number of positions must be a positive integer (at least 1)',
  })
  numberOfPositions?: number;

  @IsOptional()
  @IsDateString(
    {},
    { message: 'Application deadline must be a valid ISO date string' },
  )
  applicationDeadline?: string;

  @IsOptional()
  @IsEnum(OpportunityStatus, {
    message: 'Status must be either "Open" or "Closed"',
  })
  status?: OpportunityStatus;
}
