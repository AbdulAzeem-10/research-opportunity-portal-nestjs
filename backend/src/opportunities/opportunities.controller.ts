import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { QueryOpportunityDto } from './dto/query-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunitiesService } from './opportunities.service';

@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  /**
   * POST /api/opportunities
   * Creates a new opportunity.
   * Returns 201 Created on success.
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createOpportunityDto: CreateOpportunityDto) {
    return await this.opportunitiesService.create(createOpportunityDto);
  }

  /**
   * GET /api/opportunities
   * Retrieves all opportunities with optional query filters (status, department, category, search).
   * Returns 200 OK on success.
   */
  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() queryDto: QueryOpportunityDto) {
    return await this.opportunitiesService.findAll(queryDto);
  }

  /**
   * GET /api/opportunities/:id
   * Retrieves a single opportunity by ID.
   * Returns 200 OK on success, 404 if not found (including after deletion), 400 if invalid ID.
   */
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.opportunitiesService.findOne(id);
  }

  /**
   * PUT /api/opportunities/:id
   * Updates an existing opportunity (e.g. updating details or marking as Closed).
   * Returns 200 OK on success, 404 if not found.
   */
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateOpportunityDto: UpdateOpportunityDto,
  ) {
    return await this.opportunitiesService.update(id, updateOpportunityDto);
  }

  /**
   * DELETE /api/opportunities/:id
   * Deletes an opportunity by ID.
   * Returns 200 OK on success, 404 if not found or already deleted.
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.opportunitiesService.remove(id);
  }

  /**
   * PATCH /api/opportunities/:id/close
   * Dedicated shortcut to mark an opportunity as Closed.
   * Returns 200 OK on success, 404 if not found.
   */
  @Patch(':id/close')
  @HttpCode(HttpStatus.OK)
  async markClosed(@Param('id', ParseObjectIdPipe) id: string) {
    return await this.opportunitiesService.markAsClosed(id);
  }
}
