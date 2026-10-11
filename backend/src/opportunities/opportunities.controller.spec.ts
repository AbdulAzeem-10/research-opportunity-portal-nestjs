import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';
import { OpportunityStatus } from './enums/opportunity-status.enum';

describe('OpportunitiesController', () => {
  let controller: OpportunitiesController;
  let service: OpportunitiesService;

  const mockOpportunity = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Computer Vision Research Assistant',
    description: 'Assist in training deep learning models for medical image segmentation.',
    department: 'Computer Science',
    professor: 'Dr. John Doe',
    status: OpportunityStatus.OPEN,
    category: 'Computer Vision',
    requirements: ['PyTorch', 'Python', 'Linear Algebra'],
    stipend: '$1500/month',
    location: 'Hybrid',
    contactEmail: 'jdoe@univ.edu',
    openSpots: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockOpportunitiesService = {
    create: jest.fn().mockResolvedValue(mockOpportunity),
    findAll: jest.fn().mockResolvedValue([mockOpportunity]),
    findOne: jest.fn().mockImplementation((id: string) => {
      if (id === mockOpportunity._id) {
        return Promise.resolve(mockOpportunity);
      }
      return Promise.reject(
        new NotFoundException(`Opportunity with ID "${id}" was not found.`),
      );
    }),
    update: jest.fn().mockImplementation((id: string, dto: UpdateOpportunityDto) => {
      if (id === mockOpportunity._id) {
        return Promise.resolve({ ...mockOpportunity, ...dto });
      }
      return Promise.reject(
        new NotFoundException(`Opportunity with ID "${id}" was not found.`),
      );
    }),
    remove: jest.fn().mockImplementation((id: string) => {
      if (id === mockOpportunity._id) {
        return Promise.resolve({
          message: 'Opportunity deleted successfully',
          id,
        });
      }
      return Promise.reject(
        new NotFoundException(`Opportunity with ID "${id}" was not found.`),
      );
    }),
    markAsClosed: jest.fn().mockImplementation((id: string) => {
      if (id === mockOpportunity._id) {
        return Promise.resolve({
          ...mockOpportunity,
          status: OpportunityStatus.CLOSED,
        });
      }
      return Promise.reject(
        new NotFoundException(`Opportunity with ID "${id}" was not found.`),
      );
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OpportunitiesController],
      providers: [
        {
          provide: OpportunitiesService,
          useValue: mockOpportunitiesService,
        },
      ],
    }).compile();

    controller = module.get<OpportunitiesController>(OpportunitiesController);
    service = module.get<OpportunitiesService>(OpportunitiesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an opportunity and return it (201)', async () => {
      const dto: CreateOpportunityDto = {
        title: 'Computer Vision Research Assistant',
        description: 'Assist in training deep learning models for medical image segmentation.',
        department: 'Computer Science',
        professor: 'Dr. John Doe',
        status: OpportunityStatus.OPEN,
      };

      const result = await controller.create(dto);
      expect(result).toEqual(mockOpportunity);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of opportunities (200)', async () => {
      const result = await controller.findAll({});
      expect(result).toEqual([mockOpportunity]);
      expect(service.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a single opportunity if found (200)', async () => {
      const result = await controller.findOne('507f1f77bcf86cd799439011');
      expect(result).toEqual(mockOpportunity);
      expect(service.findOne).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if opportunity does not exist (404)', async () => {
      await expect(
        controller.findOne('507f1f77bcf86cd799439099'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update and return the opportunity, allowing status change to Closed (200)', async () => {
      const updateDto: UpdateOpportunityDto = {
        status: OpportunityStatus.CLOSED,
      };

      const result = await controller.update(
        '507f1f77bcf86cd799439011',
        updateDto,
      );
      expect(result.status).toBe(OpportunityStatus.CLOSED);
      expect(service.update).toHaveBeenCalledWith(
        '507f1f77bcf86cd799439011',
        updateDto,
      );
    });

    it('should throw NotFoundException if updating non-existent opportunity (404)', async () => {
      await expect(
        controller.update('507f1f77bcf86cd799439099', {
          title: 'Non-existent',
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete opportunity and return success response (200)', async () => {
      const result = await controller.remove('507f1f77bcf86cd799439011');
      expect(result).toEqual({
        message: 'Opportunity deleted successfully',
        id: '507f1f77bcf86cd799439011',
      });
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException if trying to delete non-existent / already deleted opportunity (404)', async () => {
      await expect(
        controller.remove('507f1f77bcf86cd799439099'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('markClosed shortcut', () => {
    it('should mark opportunity as Closed (200)', async () => {
      const result = await controller.markClosed('507f1f77bcf86cd799439011');
      expect(result.status).toBe(OpportunityStatus.CLOSED);
    });
  });
});
