interface Constraint {
  verb: string;
  field: string;
  value: string;
}

interface Criteria {
  constraint: Constraint[];
}

interface AdvancedConstraints {
  criteria: Criteria[];
}

export interface Community {
  id: string;
  queryId: string;
  type: string;
  name: string;
  shortName: string;
  displayName: string;
  displayShortName: string;
  creationDate: string;
  lastUpdateDate: string;
  description: string;
  logoUrl: string;
  status: string;
  claim: string;
  membership: string;
  zenodoCommunity: string;
  plan: string;
  featured: any;
  subjects: any[]; // You might want to define a more specific type based on actual data
  fos: any[]; // Field of Study - define a specific type if known
  sdg: any[]; // Sustainable Development Goals - define a specific type if known
  advancedConstraints: AdvancedConstraints;
  removeConstraints: any;
  otherZenodoCommunities: string[];
  suggestedAcknowledgements: string[];
}
