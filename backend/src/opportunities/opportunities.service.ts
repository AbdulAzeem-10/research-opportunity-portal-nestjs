import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { QueryOpportunityDto } from './dto/query-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunityStatus } from './enums/opportunity-status.enum';
import {
  Opportunity,
  OpportunityDocument,
} from './schemas/opportunity.schema';

@Injectable()
export class OpportunitiesService {
  private readonly logger = new Logger(OpportunitiesService.name);

  constructor(
    @InjectModel(Opportunity.name)
    private readonly opportunityModel: Model<OpportunityDocument>,
  ) {}

  async create(
    createOpportunityDto: CreateOpportunityDto,
  ): Promise<OpportunityDocument> {
    this.logger.log(`Creating opportunity: "${createOpportunityDto.title}"`);
    const created = new this.opportunityModel(createOpportunityDto);
    return await created.save();
  }

  async findAll(
    queryDto: QueryOpportunityDto = {},
  ): Promise<OpportunityDocument[]> {
    const filter: Record<string, any> = {};

    if (queryDto.status) {
      filter.status = queryDto.status;
    }

    if (queryDto.department) {
      filter.department = { $regex: queryDto.department, $options: 'i' };
    }

    if (queryDto.category) {
      filter.category = { $regex: queryDto.category, $options: 'i' };
    }

    if (queryDto.search) {
      filter.$or = [
        { title: { $regex: queryDto.search, $options: 'i' } },
        { description: { $regex: queryDto.search, $options: 'i' } },
        { professor: { $regex: queryDto.search, $options: 'i' } },
        { department: { $regex: queryDto.search, $options: 'i' } },
      ];
    }

    return await this.opportunityModel
      .find(filter)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findOne(id: string): Promise<OpportunityDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid Opportunity ID: "${id}". Must be a valid 24-character hexadecimal MongoDB ObjectId.`,
      );
    }

    const opportunity = await this.opportunityModel.findById(id).exec();
    if (!opportunity) {
      throw new NotFoundException(`Opportunity with ID "${id}" was not found.`);
    }

    return opportunity;
  }

  async update(
    id: string,
    updateOpportunityDto: UpdateOpportunityDto,
  ): Promise<OpportunityDocument> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid Opportunity ID: "${id}". Must be a valid 24-character hexadecimal MongoDB ObjectId.`,
      );
    }

    const updated = await this.opportunityModel
      .findByIdAndUpdate(id, { $set: updateOpportunityDto }, {
        new: true,
        runValidators: true,
      })
      .exec();

    if (!updated) {
      throw new NotFoundException(`Opportunity with ID "${id}" was not found.`);
    }

    this.logger.log(`Opportunity updated: "${id}"`);
    return updated;
  }

  async remove(id: string): Promise<{ message: string; id: string }> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(
        `Invalid Opportunity ID: "${id}". Must be a valid 24-character hexadecimal MongoDB ObjectId.`,
      );
    }

    const deleted = await this.opportunityModel.findByIdAndDelete(id).exec();
    if (!deleted) {
      throw new NotFoundException(`Opportunity with ID "${id}" was not found.`);
    }

    this.logger.log(`Opportunity deleted: "${id}"`);
    return {
      message: 'Opportunity deleted successfully',
      id,
    };
  }

  async markAsClosed(id: string): Promise<OpportunityDocument> {
    return this.update(id, { status: OpportunityStatus.CLOSED });
  }
}
