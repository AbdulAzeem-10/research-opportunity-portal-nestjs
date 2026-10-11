import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OpportunityStatus } from '../enums/opportunity-status.enum';

export class QueryOpportunityDto {
  @IsOptional()
  @IsEnum(OpportunityStatus, {
    message: 'Status must be one of: Open, In Progress, Closed',
  })
  status?: OpportunityStatus;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  search?: string;
}
