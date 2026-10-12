import {
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { OpportunityStatus } from '../enums/opportunity-status.enum';

export class CreateOpportunityDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Research area is required' })
  @IsString({ message: 'Research area must be a string' })
  researchArea: string;

  @IsNotEmpty({ message: 'Faculty member name is required' })
  @IsString({ message: 'Faculty member name must be a string' })
  facultyMemberName: string;

  @IsNotEmpty({ message: 'Department is required' })
  @IsString({ message: 'Department must be a string' })
  department: string;

  @IsArray({ message: 'Required skills must be an array of strings' })
  @IsString({ each: true, message: 'Each required skill must be a string' })
  requiredSkills: string[];

  @IsNotEmpty({ message: 'Number of positions is required' })
  @Type(() => Number)
  @IsInt({ message: 'Number of positions must be an integer' })
  @Min(1, {
    message: 'Number of positions must be a positive integer (at least 1)',
  })
  numberOfPositions: number;

  @IsNotEmpty({ message: 'Application deadline is required' })
  @IsDateString(
    {},
    { message: 'Application deadline must be a valid ISO date string' },
  )
  applicationDeadline: string;

  @IsOptional()
  @IsEnum(OpportunityStatus, {
    message: 'Status must be either "Open" or "Closed"',
  })
  status?: OpportunityStatus;
}
