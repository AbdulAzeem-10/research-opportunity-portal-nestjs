import {
  IsArray,
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { OpportunityStatus } from '../enums/opportunity-status.enum';

export class CreateOpportunityDto {
  @IsNotEmpty({ message: 'Title is required and cannot be empty' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'Description is required and cannot be empty' })
  @IsString({ message: 'Description must be a string' })
  description: string;

  @IsNotEmpty({ message: 'Department is required and cannot be empty' })
  @IsString({ message: 'Department must be a string' })
  department: string;

  @IsNotEmpty({ message: 'Professor is required and cannot be empty' })
  @IsString({ message: 'Professor must be a string' })
  professor: string;

  @IsOptional()
  @IsEnum(OpportunityStatus, {
    message: 'Status must be one of: Open, In Progress, Closed',
  })
  status?: OpportunityStatus;

  @IsOptional()
  @IsString({ message: 'Category must be a string' })
  category?: string;

  @IsOptional()
  @IsArray({ message: 'Requirements must be an array of strings' })
  @IsString({ each: true, message: 'Each requirement must be a string' })
  requirements?: string[];

  @IsOptional()
  @IsDateString({}, { message: 'Deadline must be a valid ISO 8601 date string' })
  deadline?: string;

  @IsOptional()
  @IsString({ message: 'Stipend must be a string' })
  stipend?: string;

  @IsOptional()
  @IsString({ message: 'Location must be a string' })
  location?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Contact email must be a valid email address' })
  contactEmail?: string;

  @IsOptional()
  @IsInt({ message: 'Open spots must be an integer' })
  @Min(1, { message: 'Open spots must be at least 1' })
  openSpots?: number;
}
