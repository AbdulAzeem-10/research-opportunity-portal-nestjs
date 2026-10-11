import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateOpportunityDto } from './dto/create-opportunity.dto';
import { UpdateOpportunityDto } from './dto/update-opportunity.dto';
import { OpportunityStatus } from './enums/opportunity-status.enum';
import { OpportunitiesController } from './opportunities.controller';
import { OpportunitiesService } from './opportunities.service';

describe('OpportunitiesController', () => {
  let controller: OpportunitiesController;
  let service: OpportunitiesService;

  const mockOpportunity = {
    _id: '507f1f77bcf86cd799439011',
    title: 'Computer Vision in Healthcare',
    description: 'Developing neural networks for 3D MRI reconstruction.',
    researchArea: 'Artificial Intelligence',
    facultyMemberName: 'Dr. Sarah Connor',
    department: 'Computer Science',
    requiredSkills: ['Python', 'PyTorch', 'Linear Algebra'],
    numberOfPositions: 2,
    applicationDeadline: new Date('2026-12-01').toISOString(),
    status: OpportunityStatus.OPEN,
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
    update: jest
      .fn()
      .mockImplementation((id: string, dto: UpdateOpportunityDto) => {
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
    it('should create an opportunity and return 201 response data', async () => {
      const dto: CreateOpportunityDto = {
        title: 'Computer Vision in Healthcare',
        description: 'Developing neural networks for 3D MRI reconstruction.',
        researchArea: 'Artificial Intelligence',
        facultyMemberName: 'Dr. Sarah Connor',
        department: 'Computer Science',
        requiredSkills: ['Python', 'PyTorch', 'Linear Algebra'],
        numberOfPositions: 2,
        applicationDeadline: '2026-12-01T00:00:00.000Z',
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
    it('should update and return the opportunity, including setting status to Closed (200)', async () => {
      const updateDto: UpdateOpportunityDto = {
        status: OpportunityStatus.CLOSED,
        numberOfPositions: 1,
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
    it('should delete opportunity and return confirmation (200)', async () => {
      const result = await controller.remove('507f1f77bcf86cd799439011');
      expect(result).toEqual({
        message: 'Opportunity deleted successfully',
        id: '507f1f77bcf86cd799439011',
      });
      expect(service.remove).toHaveBeenCalledWith('507f1f77bcf86cd799439011');
    });

    it('should throw NotFoundException when deleting non-existent opportunity (404)', async () => {
      await expect(
        controller.remove('507f1f77bcf86cd799439099'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
