import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';
import { OpportunityStatus } from '../src/opportunities/enums/opportunity-status.enum';

describe('Opportunities API (e2e)', () => {
  let app: INestApplication;
  let createdOpportunityId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalFilters(new AllExceptionsFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /api/opportunities', () => {
    it('should return 400 when missing required fields', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/opportunities')
        .send({})
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.error).toBe('Bad Request');
      expect(Array.isArray(response.body.message)).toBe(true);
      expect(response.body.message).toContain('Title is required');
      expect(response.body.message).toContain('Description is required');
      expect(response.body.message).toContain('Research area is required');
      expect(response.body.message).toContain('Faculty member name is required');
      expect(response.body.message).toContain('Department is required');
      expect(response.body.message).toContain('Number of positions is required');
      expect(response.body.message).toContain('Application deadline is required');
    });

    it('should return 400 when status is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/opportunities')
        .send({
          title: 'Quantum Computing Research',
          description: 'Exploring quantum algorithms.',
          researchArea: 'Quantum Computing',
          facultyMemberName: 'Dr. Feynman',
          department: 'Physics',
          requiredSkills: ['Linear Algebra'],
          numberOfPositions: 1,
          applicationDeadline: '2026-12-31T23:59:59.000Z',
          status: 'Pending',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'Status must be either "Open" or "Closed"',
      );
    });

    it('should return 400 when numberOfPositions is negative or zero', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/opportunities')
        .send({
          title: 'Quantum Computing Research',
          description: 'Exploring quantum algorithms.',
          researchArea: 'Quantum Computing',
          facultyMemberName: 'Dr. Feynman',
          department: 'Physics',
          requiredSkills: ['Linear Algebra'],
          numberOfPositions: 0,
          applicationDeadline: '2026-12-31T23:59:59.000Z',
        })
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain(
        'Number of positions must be a positive integer (at least 1)',
      );
    });

    it('should return 201 and create opportunity with valid fields', async () => {
      const payload = {
        title: 'Deep Learning in Medical Imaging',
        description: 'Developing diffusion models for 3D MRI reconstruction.',
        researchArea: 'Artificial Intelligence',
        facultyMemberName: 'Dr. Maria Chen',
        department: 'Biomedical Engineering',
        requiredSkills: ['Python', 'PyTorch', 'Linear Algebra'],
        numberOfPositions: 2,
        applicationDeadline: '2026-11-30T23:59:59.000Z',
        status: OpportunityStatus.OPEN,
      };

      const response = await request(app.getHttpServer())
        .post('/api/opportunities')
        .send(payload)
        .expect(201);

      expect(response.body._id).toBeDefined();
      expect(response.body.title).toBe(payload.title);
      expect(response.body.description).toBe(payload.description);
      expect(response.body.researchArea).toBe(payload.researchArea);
      expect(response.body.facultyMemberName).toBe(payload.facultyMemberName);
      expect(response.body.department).toBe(payload.department);
      expect(response.body.requiredSkills).toEqual(payload.requiredSkills);
      expect(response.body.numberOfPositions).toBe(payload.numberOfPositions);
      expect(response.body.status).toBe(OpportunityStatus.OPEN);

      createdOpportunityId = response.body._id;
    });
  });

  describe('GET /api/opportunities', () => {
    it('should return 200 and an array of opportunities', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/opportunities')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      const found = response.body.find(
        (item: any) => item._id === createdOpportunityId,
      );
      expect(found).toBeDefined();
      expect(found.title).toBe('Deep Learning in Medical Imaging');
    });

    it('should filter opportunities by status', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/opportunities?status=Open')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      response.body.forEach((opp: any) => {
        expect(opp.status).toBe(OpportunityStatus.OPEN);
      });
    });
  });

  describe('GET /api/opportunities/:id', () => {
    it('should return 200 and opportunity details for existing ID', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/opportunities/${createdOpportunityId}`)
        .expect(200);

      expect(response.body._id).toBe(createdOpportunityId);
      expect(response.body.title).toBe('Deep Learning in Medical Imaging');
    });

    it('should return 400 when ID format is invalid', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/opportunities/invalid-id-123')
        .expect(400);

      expect(response.body.statusCode).toBe(400);
      expect(response.body.message).toContain('Expected a valid 24-character hexadecimal MongoDB ObjectId');
    });

    it('should return 404 when ID does not exist', async () => {
      const nonExistentId = '507f1f77bcf86cd799439099';
      const response = await request(app.getHttpServer())
        .get(`/api/opportunities/${nonExistentId}`)
        .expect(404);

      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toContain('was not found');
    });
  });

  describe('PUT /api/opportunities/:id', () => {
    it('should return 200 and update opportunity, including setting status to Closed', async () => {
      const updatePayload = {
        status: OpportunityStatus.CLOSED,
        numberOfPositions: 1,
      };

      const response = await request(app.getHttpServer())
        .put(`/api/opportunities/${createdOpportunityId}`)
        .send(updatePayload)
        .expect(200);

      expect(response.body._id).toBe(createdOpportunityId);
      expect(response.body.status).toBe(OpportunityStatus.CLOSED);
      expect(response.body.numberOfPositions).toBe(1);
    });

    it('should return 404 when updating non-existent opportunity', async () => {
      const nonExistentId = '507f1f77bcf86cd799439099';
      const response = await request(app.getHttpServer())
        .put(`/api/opportunities/${nonExistentId}`)
        .send({ title: 'New Title' })
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/opportunities/:id', () => {
    it('should return 200 on successful deletion', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/opportunities/${createdOpportunityId}`)
        .expect(200);

      expect(response.body.message).toContain('deleted successfully');
      expect(response.body.id).toBe(createdOpportunityId);
    });

    it('should return 404 when requesting an ID after deleting it (GET)', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/opportunities/${createdOpportunityId}`)
        .expect(404);

      expect(response.body.statusCode).toBe(404);
      expect(response.body.message).toContain('was not found');
    });

    it('should return 404 when attempting to delete an already deleted opportunity (DELETE)', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/api/opportunities/${createdOpportunityId}`)
        .expect(404);

      expect(response.body.statusCode).toBe(404);
    });
  });
});
