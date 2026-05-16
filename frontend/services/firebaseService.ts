import { Relationship } from '../types';

// In-memory store for the demo to simulate a database
let mockRelationshipsStore: Relationship[] = [
  {
    id: 'rel_1',
    startupId: 's1',
    mentorId: 'm1',
    programmeId: 'p1',
    status: 'approved',
    aiScore: 95
  },
  {
    id: 'rel_2',
    startupId: 's3',
    mentorId: 'm3',
    programmeId: 'p2',
    status: 'approved',
    aiScore: 82
  }
];

/**
 * Placeholder function to save a relationship to Firestore.
 */
export const saveRelationship = async (
  startupId: string,
  mentorId: string,
  programmeId: string,
  status: 'approved' | 'pending' | 'rejected' = 'approved',
  aiScore?: number
): Promise<Relationship> => {
  console.log(`Saving relationship: Startup ${startupId}, Mentor ${mentorId}, Programme ${programmeId}, Status ${status}, Score ${aiScore}`);
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  const newRelationship: Relationship = {
    id: `rel_${Date.now()}`,
    startupId,
    mentorId,
    programmeId,
    status,
    aiScore
  };

  // Add to our in-memory store
  mockRelationshipsStore = [newRelationship, ...mockRelationshipsStore];
  
  return newRelationship;
};

/**
 * Placeholder function to get all relationships from Firestore.
 */
export const getRelationships = async (): Promise<Relationship[]> => {
  console.log('Fetching relationships...');
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  return mockRelationshipsStore;
};