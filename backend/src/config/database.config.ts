import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const getDatabaseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => ({
  uri:
    configService.get<string>('MONGODB_URI') ||
    'mongodb://127.0.0.1:27017/research_opportunity_db',
});
