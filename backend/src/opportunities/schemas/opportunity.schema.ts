import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { OpportunityStatus } from '../enums/opportunity-status.enum';

export type OpportunityDocument = HydratedDocument<Opportunity>;
export { OpportunityStatus };

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
  department: string;

  @Prop({ required: true, trim: true })
  professor: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(OpportunityStatus),
    default: OpportunityStatus.OPEN,
  })
  status: OpportunityStatus;

  @Prop({ trim: true, default: 'General Research' })
  category: string;

  @Prop({ type: [String], default: [] })
  requirements: string[];

  @Prop({ type: Date, default: null })
  deadline: Date;

  @Prop({ trim: true, default: 'Unpaid / Course Credit' })
  stipend: string;

  @Prop({ trim: true, default: 'On-Campus' })
  location: string;

  @Prop({ trim: true })
  contactEmail: string;

  @Prop({ type: Number, default: 1 })
  openSpots: number;
}

export const OpportunitySchema = SchemaFactory.createForClass(Opportunity);

// Add index on status and department for fast lookups
OpportunitySchema.index({ status: 1 });
OpportunitySchema.index({ department: 1 });
OpportunitySchema.index({ title: 'text', description: 'text' });
