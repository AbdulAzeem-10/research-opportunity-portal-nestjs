export type OpportunityStatus = 'Open' | 'Closed';

export interface Opportunity {
  _id: string;
  title: string;
  description: string;
  researchArea: string;
  facultyMemberName: string;
  department: string;
  requiredSkills: string[];
  numberOfPositions: number;
  applicationDeadline: string;
  status: OpportunityStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpportunityFormData {
  title: string;
  description: string;
  researchArea: string;
  facultyMemberName: string;
  department: string;
  requiredSkills: string; // Comma-separated in the form, converted to string[]
  numberOfPositions: number;
  applicationDeadline: string;
  status: OpportunityStatus;
}
