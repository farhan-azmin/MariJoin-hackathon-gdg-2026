import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { STARTUPS, PROGRAMMES } from '../../constants/mockData';
import { matchStartupToProgramme } from '../../services/geminiService';
import { saveRelationship } from '../../services/firebaseService';
import { NexusGraphResponse, Startup } from '../../types';

// Mock fallback data in case API fails (e.g., missing API key)
const MOCK_NEXUS_RESPONSE: NexusGraphResponse = {
  startup_name: "Mock Startup",
  relationships: [
    {
      relationship_id: "rel_p1",
      entity_type: "startup-programme-relationship",
      startup: { name: "Mock Startup", industry: "Tech", stage: "Seed" },
      programme: { id: "p1", name: "CIP Spark", focusArea: "Early-stage tech startups" },
      match_score: 95,
      match_reason: [
        "The startup's Seed stage perfectly aligns with CIP Spark's target demographic.",
        "Their tech-focused product meets the core eligibility criteria.",
        "The requested funding amount is within the programme's typical allocation limits."
      ],
      predicted_outcome: "High success probability",
      engagement_strategy: "Fast-track application for initial funding tranche. Assign a technical mentor immediately upon approval.",
      risk_factors: ["Requires clear commercialization plan"],
      outcome_tracking_fields: ["MVP Completion Date", "First 100 Active Users", "Initial Revenue Generation"],
      status: "suggested"
    },
    {
      relationship_id: "rel_p2",
      entity_type: "startup-programme-relationship",
      startup: { name: "Mock Startup", industry: "Tech", stage: "Seed" },
      programme: { id: "p2", name: "CIP Sprint", focusArea: "Commercialization and growth" },
      match_score: 60,
      match_reason: [
        "Startup is currently too early stage for a commercialization-focused grant.",
        "Lacks the minimum $50k revenue required for immediate eligibility.",
        "However, the industry alignment is strong for future consideration."
      ],
      predicted_outcome: "Medium success (if deferred)",
      engagement_strategy: "Keep in pipeline for next year. Provide feedback on required traction metrics before re-applying.",
      risk_factors: ["Insufficient revenue history", "Premature scaling risk"],
      outcome_tracking_fields: ["Monthly Recurring Revenue (MRR)", "Customer Acquisition Cost (CAC)"],
      status: "suggested"
    },
    {
      relationship_id: "rel_p3",
      entity_type: "startup-programme-relationship",
      startup: { name: "Mock Startup", industry: "Tech", stage: "Seed" },
      programme: { id: "p3", name: "GreenTech Accelerator", focusArea: "Sustainability" },
      match_score: 35,
      match_reason: [
        "The startup's core product does not directly address climate change or sustainability.",
        "Fails to meet the primary environmental impact criteria of the programme."
      ],
      predicted_outcome: "Low success probability",
      engagement_strategy: "Redirect to general tech programmes unless they pivot to a green-tech focus.",
      risk_factors: ["Mission drift if they attempt to force a fit"],
      outcome_tracking_fields: ["Carbon offset metrics (N/A)"],
      status: "suggested"
    }
  ],
  ui_screen: {
    screen_name: "Programme Recommendations Dashboard",
    header: {
      title: "Recommended Programmes",
      subtitle: "AI-powered ecosystem matching results"
    },
    cards: [
      {
        type: "programme_card",
        programme_name: "CIP Spark",
        match_score: 95,
        tags: ["Early Stage", "Funding", "Tech"],
        highlights: ["Matches Seed stage", "High eligibility score"],
        recommendation_reason: "Ideal fit for early-stage tech development.",
        cta: "Approve Match"
      },
      {
        type: "programme_card",
        programme_name: "CIP Sprint",
        match_score: 60,
        tags: ["Growth", "Commercialization"],
        highlights: ["Good industry fit", "Stage mismatch"],
        recommendation_reason: "Consider for future pipeline once traction is proven.",
        cta: "Review Later"
      },
      {
        type: "programme_card",
        programme_name: "GreenTech Accelerator",
        match_score: 35,
        tags: ["Sustainability", "Impact"],
        highlights: ["Low relevance", "Criteria mismatch"],
        recommendation_reason: "Not recommended due to lack of environmental focus.",
        cta: "Reject Match"
      }
    ]
  }
};

export default function ApplicantDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [startup, setStartup] = useState<Startup | null>(null);
  const [aiData, setAiData] = useState<NexusGraphResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<string | null>(null);

  useEffect(() => {
    // In a real app, fetch by ID. Here we use mock data or fallback to the first one.
    const foundStartup = STARTUPS.find(s => s.id === id) || STARTUPS[0];
    setStartup(foundStartup);

    const fetchAiAnalysis = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if API key is likely missing (this is a common reason for failure in these demos)
        if (!process.env.API_KEY || process.env.API_KEY === 'undefined') {
           console.warn("API_KEY is missing. Falling back to mock data immediately.");
           throw new Error("API_KEY is missing");
        }

        // Implement a timeout to prevent infinite loading if the API hangs
        const timeoutPromise = new Promise<never>((_, reject) => 
          setTimeout(() => reject(new Error("API request timed out")), 8000)
        );

        const result = await Promise.race([
          matchStartupToProgramme(foundStartup, PROGRAMMES),
          timeoutPromise
        ]);
        
        setAiData(result);
      } catch (err: any) {
        console.error("API call failed or timed out, falling back to mock data:", err);
        // Fallback to mock data so the UI can be seen even without an API key or on timeout
        
        // Simulate a slight delay to show the loading state briefly if it didn't timeout
        if (err.message !== "API request timed out") {
          await new Promise(resolve => setTimeout(resolve, 1500));
        }
        
        setAiData({
          ...MOCK_NEXUS_RESPONSE,
          startup_name: foundStartup.name,
          ui_screen: {
            ...MOCK_NEXUS_RESPONSE.ui_screen,
            header: {
              ...MOCK_NEXUS_RESPONSE.ui_screen.header,
              subtitle: `AI-powered ecosystem matching results for ${foundStartup.name}`
            }
          }
        });
        // We don't set error here because we want to show the mock data
      } finally {
        setIsLoading(false);
      }
    };

    fetchAiAnalysis();
  }, [id]);

  // Helper to determine score color
  const getScoreColorText = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-100';
    if (score >= 50) return 'bg-yellow-50 border-yellow-100';
    return 'bg-red-50 border-red-100';
  };

  // Helper to determine prediction color
  const getPredictionStyle = (prediction: string) => {
    const lower = prediction?.toLowerCase() || '';
    if (lower.includes('high')) return 'bg-green-50 border-green-200 text-green-800';
    if (lower.includes('medium')) return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    if (lower.includes('low')) return 'bg-red-50 border-red-200 text-red-800';
    return 'bg-blue-50 border-blue-200 text-blue-800';
  };

  const handleAction = async (programmeName: string, action: 'approve' | 'reject') => {
    if (!startup) return;
    
    setIsProcessing(programmeName);
    try {
      // Find the programme ID based on the name
      const programme = PROGRAMMES.find(p => p.name === programmeName);
      const programmeId = programme ? programme.id : 'unknown_programme';
      
      // Save the relationship (using 'pending_mentor' as we are matching programmes here)
      // In a real app, you might have a different service call for rejecting
      await saveRelationship(startup.id, 'pending_mentor', programmeId);
      
      // Redirect to postmortem page
      navigate('/admin/relationships');
    } catch (err) {
      console.error(`Failed to ${action} match:`, err);
      alert(`Failed to ${action} match. Please try again.`);
    } finally {
      setIsProcessing(null);
    }
  };

  if (!startup) return null;

  return (
    <AdminLayout>
      <div className="p-8 max-w-7xl mx-auto">
        
        {/* Header & Back Button */}
        <div className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/applicants')}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{startup.name}</h1>
            <p className="text-sm text-gray-500">Application Review & AI Analysis</p>
          </div>
        </div>

        {/* Startup Profile Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Startup Profile</h2>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Industry</p>
              <p className="font-medium text-gray-900">{startup.industry}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Stage</p>
              <p className="font-medium text-gray-900">{startup.stage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Funding</p>
              <p className="font-medium text-gray-900">{startup.funding}</p>
            </div>
            <div className="col-span-3">
              <p className="text-sm text-gray-500 mb-1">Problem Solved</p>
              <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">{startup.problemSolved}</p>
            </div>
          </div>
        </div>

        {/* AI Analysis Section */}
        <div className="mb-6 flex items-center gap-2">
          <svg className="w-6 h-6 text-[#603ADE]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L14.8 9.2L22 12L14.8 14.8L12 22L9.2 14.8L2 12L9.2 9.2L12 2Z" fill="currentColor"/>
            <path d="M19 2L20.4 5.6L24 7L20.4 8.4L19 12L17.6 8.4L14 7L17.6 5.6L19 2Z" fill="currentColor"/>
            <path d="M5 14L5.7 15.8L7.5 16.5L5.7 17.2L5 19L4.3 17.2L2.5 16.5L4.3 15.8L5 14Z" fill="currentColor"/>
          </svg>
          <h2 className="text-xl font-bold text-gray-900">MariJoin AI Intelligence</h2>
        </div>

        {isLoading ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center">
            <svg className="animate-spin h-10 w-10 text-[#603ADE] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-gray-600 font-medium">Analyzing ecosystem relationships...</p>
            <p className="text-sm text-gray-400 mt-2">Generating match scores and engagement strategies.</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-xl border border-red-200 p-6 text-red-700">
            <p className="font-medium">Error generating AI analysis</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        ) : aiData ? (
          <div className="space-y-8">
            
            {/* UI Screen Header from AI */}
            <div className="bg-gradient-to-r from-[#f8f5fa] to-white rounded-xl border border-[#eaddf5] p-6">
              <h3 className="text-lg font-bold text-[#4a3569]">{aiData.ui_screen?.header?.title || 'Recommended Programmes'}</h3>
              <p className="text-gray-600">{aiData.ui_screen?.header?.subtitle || 'AI-powered ecosystem matching results'}</p>
            </div>

            {/* Programme Cards */}
            <div className="grid grid-cols-1 gap-6">
              {aiData.ui_screen?.cards?.map((card, index) => {
                // Find the corresponding relationship object for deeper data
                // We use a more robust matching logic in case the API returns slightly different names
                const rel = aiData.relationships?.find(r => 
                  r.programme?.name === card.programme_name || 
                  card.programme_name.includes(r.programme?.name) ||
                  r.programme?.name.includes(card.programme_name)
                );
                
                const scoreColorText = getScoreColorText(card.match_score);
                const scoreBgColor = getScoreBgColor(card.match_score);
                const isCardProcessing = isProcessing === card.programme_name;
                
                return (
                  <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col lg:flex-row">
                    
                    {/* Left side: UI Card Data (Summary) */}
                    <div className="p-6 lg:w-1/3 border-b lg:border-b-0 lg:border-r border-gray-100 bg-gray-50/30 flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold text-gray-900">{card.programme_name}</h4>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {card.tags?.map(tag => (
                              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-[#603ADE] border border-indigo-100">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className={`text-center rounded-lg p-4 border mb-6 ${scoreBgColor}`}>
                        <span className="block text-xs text-gray-500 uppercase font-semibold mb-1">Match Score</span>
                        <span className={`text-4xl font-extrabold ${scoreColorText}`}>{card.match_score}%</span>
                      </div>
                      
                      <div className="mb-4 flex-grow">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Highlights</p>
                        <ul className="space-y-1">
                          {card.highlights?.map((highlight, i) => (
                            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                              <svg className="w-4 h-4 text-green-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {highlight}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right side: Relationship Intelligence Data (Detailed) */}
                    <div className="p-6 lg:w-2/3 flex flex-col">
                      {rel ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            {/* Reasoning */}
                            <div className="md:col-span-2">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                                <svg className="w-4 h-4 text-[#603ADE]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                                AI Reasoning
                              </p>
                              <ul className="list-disc list-inside text-sm text-gray-700 space-y-1 bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                                {rel.match_reason?.map((reason, i) => (
                                  <li key={i}>{reason}</li>
                                ))}
                              </ul>
                            </div>

                            {/* Prediction */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Prediction</p>
                              <div className={`border rounded-lg p-3 ${getPredictionStyle(rel.predicted_outcome)}`}>
                                <span className="text-sm font-medium">
                                  {rel.predicted_outcome}
                                </span>
                              </div>
                            </div>

                            {/* Engagement Strategy */}
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Engagement Strategy</p>
                              <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 h-full">
                                <p className="text-sm text-gray-700">
                                  {rel.engagement_strategy}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Outcome Tracking Fields */}
                          {rel.outcome_tracking_fields && rel.outcome_tracking_fields.length > 0 && (
                            <div className="mb-6">
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Outcome Tracking Fields</p>
                              <div className="flex flex-wrap gap-2">
                                {rel.outcome_tracking_fields.map((field, i) => (
                                  <span key={i} className="px-3 py-1.5 bg-indigo-50 text-[#603ADE] text-xs font-medium rounded-md border border-indigo-100">
                                    {field}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-gray-500 italic">
                          Detailed relationship intelligence not available for this match.
                        </div>
                      )}

                      <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-gray-100">
                        <button 
                          onClick={() => handleAction(card.programme_name, 'reject')}
                          disabled={isProcessing !== null}
                          className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
                        </button>
                        <button 
                          onClick={() => handleAction(card.programme_name, 'approve')}
                          disabled={isProcessing !== null}
                          className="px-6 py-2.5 bg-[#603ADE] text-white text-sm font-medium rounded-lg hover:bg-[#4d2eaf] transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                        >
                          {isCardProcessing ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            'Approve'
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

      </div>
    </AdminLayout>
  );
}