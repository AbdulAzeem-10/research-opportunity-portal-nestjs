import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OpportunityStatus } from '../enums/opportunity-status.enum';

export class QueryOpportunityDto {
  @IsOptional()
  @IsEnum(OpportunityStatus, {
    message: 'Status must be either "Open" or "Closed"',
  })
  status?: OpportunityStatus;

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  researchArea?: string;
}
