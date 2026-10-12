import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OpportunityStatus } from '../enums/opportunity-status.enum';

export type OpportunityDocument = HydratedDocument<Opportunity>;

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (_, ret: any) => {
      delete ret.__v;
      return ret;
    },
  },
})
export class Opportunity {
  @Prop({ required: true, trim: true })
  title: string;

  @Prop({ required: true, trim: true })
  description: string;

  @Prop({ required: true, trim: true })
  researchArea: string;

  @Prop({ required: true, trim: true })
  facultyMemberName: string;

  @Prop({ required: true, trim: true })
  department: string;

  @Prop({
    type: [{ type: String, trim: true }],
    required: true,
    validate: {
      validator: (v: string[]) => Array.isArray(v) && v.length > 0,
      message: 'At least one required skill must be provided',
    },
  })
  requiredSkills: string[];

  @Prop({ type: Number, required: true, min: 1 })
  numberOfPositions: number;

  @Prop({ type: Date, required: true })
  applicationDeadline: Date;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(OpportunityStatus),
    default: OpportunityStatus.OPEN,
  })
  status: OpportunityStatus;
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);

// Add indexes for common query patterns
OpportunitySchema.index({ status: 1, createdAt: -1 });
OpportunitySchema.index({ department: 1 });
