import { GoogleGenAI, Type } from '@google/genai';
import { Startup, Programme, NexusGraphResponse } from '../types';

// Initialize the Gemini API client
// Note: process.env.API_KEY is expected to be provided by the environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY, vertexai: true });

/**
 * Matches a startup to programmes using NexusGraph AI relationship intelligence.
 * 
 * @param startup The startup profile to match.
 * @param programmes The list of available programmes.
 * @returns A promise that resolves to the NexusGraphResponse containing relationships and UI data.
 */
export const matchStartupToProgramme = async (
  startup: Startup,
  programmes: Programme[]
): Promise<NexusGraphResponse> => {
  const prompt = `
You are MariJoin AI, an ecosystem relationship intelligence system.

You generate:
1. Structured relationship intelligence (for backend storage)
2. UI-ready data (for frontend rendering)

Your goal is to find the SINGLE BEST matching Cradle programme for the given startup and produce both:
- machine-readable relationship objects
- human-readable UI components

---

# INPUT

## Startup Profile
Name: ${startup.name}
Industry: ${startup.industry}
Stage: ${startup.stage}
Goals: Seeking funding and market expansion
Challenges: ${startup.problemSolved}

---

## Programmes List
${JSON.stringify(programmes, null, 2)}

---

# TASK

1. Analyze all programmes and select the SINGLE BEST fit for the startup.
2. Generate match_score (0–100). This should reflect a high degree of confidence if it's the best match.
3. Generate match_reason (3–5 detailed, comprehensive paragraphs explaining exactly why this is the best fit, referencing specific startup details and programme criteria).
4. Predict success outcome.
5. Create a detailed engagement strategy.
6. Define outcome tracking fields (metrics to monitor success).
7. Build a relationship intelligence object for this single match.
8. Build a UI card for frontend display for this single match.

---

# OUTPUT FORMAT (STRICT JSON ONLY)

Return ONLY valid JSON with two sections:

{
 "startup_name": "${startup.name}",

 "relationships": [
  {
   "relationship_id": "auto-generated",
   "entity_type": "startup-programme-relationship",

   "startup": {
    "name": "${startup.name}",
    "industry": "${startup.industry}",
    "stage": "${startup.stage}"
   },

   "programme": {
    "id": "programme_id",
    "name": "Programme Name",
    "focusArea": "Focus Area"
   },

   "match_score": 0 to 100,

   "match_reason": [
    "Detailed paragraph 1 explaining the score and alignment...",
    "Detailed paragraph 2 explaining the score and alignment...",
    "Detailed paragraph 3 explaining the score and alignment..."
   ],

   "predicted_outcome": "High / Medium / Low success",

   "engagement_strategy": "Detailed strategy on how startup should engage with the programme...",

   "risk_factors": [
    "Optional risks"
   ],

   "outcome_tracking_fields": [
    "Metric 1 to track (e.g., MVP completion)",
    "Metric 2 to track (e.g., First 100 users)"
   ],

   "status": "suggested"
  }
 ],

 "ui_screen": {
  "screen_name": "Programme Recommendations Dashboard",

  "header": {
   "title": "Best Recommended Programme",
   "subtitle": "AI-powered ecosystem matching result for ${startup.name}"
  },

  "cards": [
   {
    "type": "programme_card",
    "programme_name": "Programme Name",
    "match_score": 92,

    "tags": ["Funding", "Early Stage", "Tech"],

    "highlights": [
     "Matches funding stage",
     "Aligned with industry focus",
     "Meets eligibility criteria"
    ],

    "recommendation_reason": "Highly aligned with startup industry and growth stage",

    "cta": "Approve Match"
   }
  ]
 }
}

---

# RULES

- Output ONLY valid JSON (no explanations)
- Return EXACTLY ONE programme match (the best one).
- match_score must be an integer from 0 to 100.
- UI must be clean and card-based.
- UI must be ready for frontend rendering (React or HTML).
- Keep UI simple but professional.
- Ensure reasoning is human-readable, detailed, and comprehensive.
- Ensure relationships are structured for database storage.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            startup_name: { type: Type.STRING },
            relationships: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  relationship_id: { type: Type.STRING },
                  entity_type: { type: Type.STRING },
                  startup: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      industry: { type: Type.STRING },
                      stage: { type: Type.STRING },
                    },
                  },
                  programme: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      name: { type: Type.STRING },
                      focusArea: { type: Type.STRING },
                    },
                  },
                  match_score: { type: Type.NUMBER },
                  match_reason: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  predicted_outcome: { type: Type.STRING },
                  engagement_strategy: { type: Type.STRING },
                  risk_factors: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  outcome_tracking_fields: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                  },
                  status: { type: Type.STRING },
                },
              },
            },
            ui_screen: {
              type: Type.OBJECT,
              properties: {
                screen_name: { type: Type.STRING },
                header: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    subtitle: { type: Type.STRING },
                  },
                },
                cards: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      programme_name: { type: Type.STRING },
                      match_score: { type: Type.NUMBER },
                      tags: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      highlights: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                      recommendation_reason: { type: Type.STRING },
                      cta: { type: Type.STRING },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!response.text) {
      throw new Error('Empty response from Gemini API');
    }

    const result: NexusGraphResponse = JSON.parse(response.text);
    return result;
  } catch (error) {
    console.error('Error matching startup to programme:', error);
    throw error;
  }
};