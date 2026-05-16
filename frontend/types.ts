export interface Startup {
  id: string;
  name: string;
  industry: string;
  stage: string;
  funding: string;
  primaryGoals: string;
  currentChallenges: string;
}

export interface Mentor {
  id: string;
  name: string;
  expertiseTags: string[];
  yearsExperience: number;
  availability: string;
}

export interface Programme {
  id: string;
  name: string;
  focusArea: string;
  eligibilityCriteria: string;
}

// New types for NexusGraph AI output (Programme Matching)
export interface RelationshipIntelligence {
  relationship_id: string;
  entity_type: string;
  startup: {
    name: string;
    industry: string;
    stage: string;
  };
  programme: {
    id: string;
    name: string;
    focusArea: string;
  };
  match_score: number;
  match_reason: string[];
  predicted_outcome: string;
  engagement_strategy: string;
  risk_factors: string[];
  outcome_tracking_fields: string[];
  status: string;
}

export interface UICard {
  type: string;
  programme_name: string;
  match_score: number;
  tags: string[];
  highlights: string[];
  recommendation_reason: string;
  cta: string;
}

export interface NexusGraphResponse {
  startup_name: string;
  relationships: RelationshipIntelligence[];
  ui_screen: {
    screen_name: string;
    header: {
      title: string;
      subtitle: string;
    };
    cards: UICard[];
  };
}

// Legacy types kept for compatibility if needed elsewhere
export interface MatchResult {
  mentorName: string;
  score: number;
  reasoning: string;
}

export interface Relationship {
  id: string;
  startupId: string;
  mentorId: string;
  programmeId: string;
  status: 'approved' | 'pending' | 'rejected';
  aiScore?: number;
}